import {localStorage, cookie} from "./storage"
import config from "@/config";
import Keycloak, {KeycloakConfig, KeycloakInstance} from "keycloak-js";
import store from "@/store";

const tokenKey = "auth_token",
      refreshKey = "auth_refresh_token";

let keycloak: KeycloakInstance;

function getAuthToken(): string|null {
    return cookie.get(tokenKey)
}

function getAuthRefreshToken(): string|null {
    return localStorage.get(refreshKey)
}

function setAuthToken(token: string|null) {
    if (token) {
        // Set for 5 hours
        cookie.set(tokenKey, token, 5)
    } else {
        cookie.remove(tokenKey)
    }
}

function setAuthRefreshToken(token: string|null) {
    if (token) {
        localStorage.set(refreshKey, token)
    } else {
        localStorage.remove(refreshKey)
    }
}

function clearAuthTokens() {
    setAuthToken(null);
    setAuthRefreshToken(null);
}

function logout() {
    const keycloak = Keycloak(config.KEYCLOAK_OPTIONS as KeycloakConfig);
    keycloak.logout().then(() => {
        clearAuthTokens();
        (store as Record<string, any>).commit('isLoggedIn', false);
        (store as Record<string, any>).commit('userInfo', null);
    });
}

function startAuthenticationFlow() {

    const keycloak = Keycloak(config.KEYCLOAK_OPTIONS as KeycloakConfig);

    // @ts-ignore
    keycloak.init({onLoad: config.KEYCLOAK_OPTIONS.onLoad}).then((auth: boolean) => {
        if (!auth) {
            console.log("not authed, need to redirect to the auth page")
            // window.location.reload();
        } else {

            (store as Record<string, any>).commit('isLoggedIn', true)

            if (process.env.NODE_ENV === "development") {
                console.log(keycloak)
            }
            keycloak.loadUserProfile().then((userProfile: any) => {
                if (process.env.NODE_ENV === "development") {
                    console.log(userProfile);
                }
                (store as Record<string, any>).commit('userInfo', userProfile)
                // (store as Record<string, any>).commit('auth', keycloak)
            });

            setAuthToken(keycloak.idToken as string);
            setAuthRefreshToken(keycloak.refreshToken as string)
        }
    });

    //Token Refresh
    setInterval(() => {
        keycloak.updateToken(70).then((refreshed) => {
            if (refreshed) {
                // Token refreshed
            }
        }).catch(() => {
            console.error('Failed to refresh token');
            clearAuthTokens();
            (store as Record<string, any>).commit('isLoggedIn', false);
            (store as Record<string, any>).commit('userInfo', null);
        });
    }, 6000);
}

async function getLoginURL(redirectUri: string) {
    const keycloak = Keycloak(config.KEYCLOAK_OPTIONS as KeycloakConfig);
    await keycloak.init({onLoad: config.KEYCLOAK_OPTIONS.onLoad})
    return keycloak.createLoginUrl({
        redirectUri: redirectUri
    });
}

function getKeycloak(): KeycloakInstance {
    if (keycloak) {
        return keycloak;
    }
    return Keycloak(config.KEYCLOAK_OPTIONS as KeycloakConfig);
}

async function getKeycloakInit() {
    const keycloak = getKeycloak();
    return keycloak.init({onLoad: config.KEYCLOAK_OPTIONS.onLoad})

}
export {startAuthenticationFlow, logout, getAuthToken, setAuthToken, getAuthRefreshToken, setAuthRefreshToken, clearAuthTokens}
