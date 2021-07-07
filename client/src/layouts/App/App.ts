import AdminLayout from "@/layouts/AdminLayout/index.vue";
import GuestLayout from "@/layouts/GuestLayout/index.vue";
import {startAuthenticationFlow, setAuthToken, setAuthRefreshToken, clearAuthTokens} from "@/utils/auth";
import Keycloak, {KeycloakConfig} from "keycloak-js";
import config from "@/config";

export default {
    name: "App",
    components: {
        AdminLayout,
        GuestLayout
    },
    data() {
        return {}
    },
    mounted() {
        startAuthenticationFlow()
    },
    computed: {
        isLoggedIn: function () {
            const self = this as Record<string, any>;
            return self.$store.getters.isLoggedIn;
        }
    },
}
