import {defineComponent} from "vue";
import JsonEditor from "@/components/JsonEditor/index.vue"
import {getObjectValueByKey} from "@/utils/helpers";

import "./third-party/ion/ion.rangeSlider.min.js"
import store from "@/store";

declare const $: any;

export default defineComponent({
    name: "LayerVisualizer",
    props: ["layerData", "layerDataKey"],
    components: {
        JsonEditor
    },
    data() {
      return {
          layeringSliderValue: "0;2"
      }
    },
    mounted() {
        (store as any).commit('changePage', `Layer Details: ${this.layerData.model.name} in ${this.layerData.model.namespace_name}`);
        this.initSlider();
    },
    methods: {
        getValue(data: {}) {
            const self = (this as any);
            if (self.dataKey != "") {
                return getObjectValueByKey(data, self.layerDataKey)
            } else {
                return data
            }
        },
        scrollTo(id: string) {
            $(`#${id}`).first().scrollIntoView({behavior: 'smooth'});
        },
        initSlider() {
            console.log('ion slider init enabled')
            $('#layering_slider').ionRangeSlider({
                type: 'double',
                postfix: ' Layer',
                values: ["A","B","C"],
                keyboard: true,
                onChange: function (obj: {}) {
                    console.log("on change", obj)
                    let t = ''
                    for (const prop in obj) {
                        // @ts-ignore
                        t += prop + ': ' + obj[prop] + '\r\n'
                    }
                    $('#result').html(t)
                },
                onLoad: function (obj: {}) {
                    console.log("on load", obj)
                    //
                }
            })
        }
    }
});
