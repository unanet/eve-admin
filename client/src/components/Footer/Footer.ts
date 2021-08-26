// @ts-nocheck
import {defineComponent} from "vue";
import config from "@/config";

export default defineComponent({
    name: "Footer",
    // @ts-ignore
    data() {
        return {
            version: config.VERSION
        }
    }
});
