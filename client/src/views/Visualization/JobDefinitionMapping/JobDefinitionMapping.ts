import AdminLayout from "@/layouts/AdminLayout/index.vue";
import ChartComponent from "@/components/Chart/index.vue";
import {definitionJobMapService as service} from "@/services"
import LayerVisualizer from "@/components/LayerVisualizer/index.vue"
import {defineComponent} from "vue";

export default defineComponent({
    name: 'JobDefinitionMap',
    components: {
        AdminLayout,
        ChartComponent,
        LayerVisualizer
    },
    data() {
        return {
            fetchedData: false,
            layerData: {},
            layerDataKey: ["definition", "data"]
        }
    },
    mounted() {
        const self = (this as any)
        service.getLayers(parseInt((this as any).$route.params.id)).then((responseData: any) => {
            self.layerData = responseData
            self.fetchedData = true
        })
    }
})
