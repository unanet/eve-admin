import {defineComponent} from "vue";
import { logout } from "@/utils/auth";
export default defineComponent({
    name: "Topbar",
    methods: {
        logout
    }
});
