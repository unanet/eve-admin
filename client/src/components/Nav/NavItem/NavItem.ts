import {defineComponent} from "vue";
import {INavItem} from "../Nav";
import NavItem from "./index.vue";
import {findIn} from "@/utils/helpers";

export default defineComponent({
    name: "NavItem",
    components: {
        NavItem,
    },
    props: ["item"],
    // @ts-ignore
    methods: {
        isTree(item: INavItem): boolean {
            return item.children && item.children.length > 0;
        },
        isRouteActive(item: INavItem): boolean {
            // @ts-ignore
            return findIn(item.url, this.$route.path)
            // const chunks = this.$route.path.split("/").shift()
            // console.log(this.$route.path)
            // console.log(route, chunks)
            // if (!chunks) {
            //     return false
            // } else {
            //     return chunks[1] == route
            // }
        },
        getIconClass(item: INavItem): string {
            return (item?.icon) ? item.icon : "fas fa-circle-notch"
        }
    }
});
