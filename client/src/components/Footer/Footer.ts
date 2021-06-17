import {defineComponent} from "vue";
import config from "@/config";

export default defineComponent({
    name: "Footer",
    data() {
        return {
            version: config.VERSION
        }
    }
});
