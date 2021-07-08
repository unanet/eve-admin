import {defineComponent} from "vue";
import { logout } from "@/utils/auth";
export default defineComponent({
    name: "Topbar",
    computed: {
        userInfo: function() {
            return (this as Record<string, any>).$store.getters.getUserInfo
        }
    },
    methods: {
        logout
    },
});
