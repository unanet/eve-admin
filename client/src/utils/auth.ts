import {localStorage, cookie} from "./storage"
import config from "@/config";
import Keycloak, {KeycloakConfig} from "keycloak-js";

const tokenKey = "auth_token",
      refreshKey = "auth_refresh_token";

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
    setAuthToken(null)
    setAuthRefreshToken(null)
}

function logout() {
    const keycloak = Keycloak(config.KEYCLOAK_OPTIONS as KeycloakConfig);
    keycloak.logout().then(() => {
        clearAuthTokens();
    });
}

function startAuthenticationFlow() {

    const keycloak = Keycloak(config.KEYCLOAK_OPTIONS as KeycloakConfig);

    // @ts-ignore
    keycloak.init({onLoad: config.KEYCLOAK_OPTIONS.onLoad}).then((auth: boolean) => {
        if (!auth) {
            window.location.reload();
        } else {
            if (process.env.NODE_ENV === "development") {
                console.log(keycloak)
            }
            keycloak.loadUserProfile().then((userProfile: any) => {
                console.log(userProfile);
            });
            setAuthToken(keycloak.idToken as string);
            setAuthRefreshToken(keycloak.refreshToken as string)
        }
    });

    //Token Refresh
    setInterval(() => {
        keycloak.updateToken(70).then((refreshed) => {
            if (refreshed) {
                console.info('Token refreshed' + refreshed);
            } else {
                console.warn('Token not refreshed, valid for '
                    // @ts-ignore
                    + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
            }
        }).catch(() => {
            console.error('Failed to refresh token');
            clearAuthTokens()
        });
    }, 6000);
}

export {startAuthenticationFlow, logout, getAuthToken, setAuthToken, getAuthRefreshToken, setAuthRefreshToken, clearAuthTokens}
