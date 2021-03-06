import AdminLayout from "@/layouts/AdminLayout/index.vue";
import ChartComponent from "@/components/Chart/index.vue";
import {IDashboardInformationEntry as type} from "@/models";
import {dashboardService as service} from "@/services"
import {defineComponent} from "vue";

export default defineComponent({
    name: 'Dashboard',
    components: {
        AdminLayout,
        ChartComponent
    },
    // @ts-ignore
    created() {
        const self = (this as Record<string, any>);
        service.getInformation().then((response: any) => {
            self.items = response as type[];

            response.forEach((item: any) => {
                self.chartConfig.labels.push(item.metadata.name);
                self.chartConfig.values.push(item.count);
            })

            self.loaded = true;
        })
    },
    data() {
        return {
            chartConfig: {
                labels: Array<String>(),
                values: Array<Number>()
            },
            loaded: false,
            items: [] as type[]
        }
    }
})
