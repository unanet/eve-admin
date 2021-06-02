import AdminLayout from "@/layouts/AdminLayout/index.vue";
import ChartComponent from "@/components/Chart/index.vue";
import {IMetadataServiceMaps as type} from "@/models";
import {serviceService as service} from "@/services"
import Visualization from "@/components/Visualization/index.vue"
export default {
    name: 'ServiceMetadataMap',
    components: {
        AdminLayout,
        ChartComponent,
        Visualization
    }
}
