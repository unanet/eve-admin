import {defineComponent} from "vue";

export default defineComponent({
    name: "Modal",
    props: {
        title: String as () => string
    }
});
