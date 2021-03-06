import AdminLayout from "@/layouts/AdminLayout/index.vue";
import ChartComponent from "@/components/Chart/index.vue";
import {servicesMap} from "@/services"
import LayerVisualizer from "@/components/LayerVisualizer/index.vue"
import {defineComponent} from "vue";

export default defineComponent({
    name: 'LayerMapping',
    components: {
        AdminLayout,
        ChartComponent,
        LayerVisualizer
    },
    // @ts-ignore
    data() {
        return {
            fetchedData: false,
            layerType: "",
            modelType: "",
            layerData: {},
            layerDataKey: ["definition"] as string[] | string, // Defaults to definitions, this is overwritten in the mounted function if this is a metadata call
        }
    },
    mounted() {
        const self = (this as Record<string, any>);

        const {id, model, type} = self.$route.params;

        if (type === "metadata") {
            // @ts-ignore
            this.layerDataKey = "metadata"
        }

        // @ts-ignore
        this.modelType = model
        // @ts-ignore
        this.layerType = type

        // @ts-ignore
        const service = servicesMap[model];

        service.getLayers(model, parseInt(id), type).then((responseData: any) => {
            self.layerData = responseData
            self.fetchedData = true
        })
    },
    methods: {
        shouldShowIndividualLayer(): boolean {
            return false
            // return this.modelType == "service"
        }
    }
})
