import NavbarComponent from "@/components/Nav/index.vue";
import TopBarComponent from "@/components/TopBar/index.vue";

export default {
    name: "AdminLayout",
    components: {
        TopBarComponent,
        NavbarComponent
    },
    data() {
        return {}
    },
    computed: {
        title: function() {
            const self = this as Record<string, any>;
            return self.$store.getters.getTitle
        }
    },
}
