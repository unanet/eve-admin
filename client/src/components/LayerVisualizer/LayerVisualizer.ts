import {defineComponent} from "vue";
import JsonEditor from "@/components/JsonEditor/index.vue"
import {getObjectValueByKey} from "@/utils/helpers";

export default defineComponent({
    name: "LayerVisualizer",
    props: ["layerData", "layerDataKey"],
    components: {
        JsonEditor
    },
    methods: {
        getValue(data: {}) {
            const self = (this as any)
            if (self.dataKey != "") {
                return getObjectValueByKey(data, self.layerDataKey)
            } else {
                return data
            }
        }
    }
});
