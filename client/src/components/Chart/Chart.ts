import {defineComponent} from "vue";

import "./third-party/chart.js/Chart.bundle.min.js";
import "./third-party/chart.js/Chart.min.js";

declare const $: any;
declare const Chart: any;

export default defineComponent({
    name: "Chart",
    props: {
        chartConfig: {},
    },
    mounted() {
        const self = (this as Record<string, any>);

        const donutChartCanvas = $('#donutChart').get(0).getContext('2d')
        const donutData = {
            labels: self.chartConfig.labels,
            datasets: [
                {
                    data: self.chartConfig.values,
                    backgroundColor: ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#A67246'],
                }
            ]
        }
        const donutOptions = {
            maintainAspectRatio: false,
            responsive: true,
        }
        //Create pie or douhnut chart
        // You can switch between pie and douhnut using the method below.
        new Chart(donutChartCanvas, {
            type: 'doughnut',
            data: donutData,
            options: donutOptions
        })
    }
});
