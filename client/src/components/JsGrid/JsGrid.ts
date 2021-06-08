import {DateTimeField, JSONField, LayeringControlField} from "./fields";
// Import JSGrid Lib files
import "./third-party/jsgrid/jsgrid.min.js"
import {FormFieldType} from "@/components/Form/FormProps";

declare const $: any;
declare let jsGrid: any;

export default {
    name: 'JsGrid',
    props: {
        tableConfig: Object,
    },
    mounted() {
        const self = this as any

        // Register fields
        jsGrid.fields.json = JSONField(jsGrid);
        jsGrid.fields[FormFieldType.datetime] = DateTimeField(jsGrid);
        // jsGrid.fields[FormFieldType.metadataControl] = MetadataControlField(jsGrid);
        jsGrid.fields[FormFieldType.layeringControl] = LayeringControlField(jsGrid);

        console.log("before", self.tableConfig)
        // If we enable editing, let's show the edit column
        if (self.tableConfig?.editing) {
            self.tableConfig.fields = self.tableConfig.fields.concat([
                {name: "controls", type: "control"}
            ])
        }

        if (self.tableConfig.extraFields) {
            self.tableConfig.fields = self.tableConfig.fields.concat(self.tableConfig.extraFields)
        }

        // https://www.npmjs.com/package/jsgrid#configuration
        // http://js-grid.com/docs/
        const jsGridObj: Record<string, any> = Object.assign({
            height: "auto",
            width: "100%",
            title: "DEFAULT TITLE",
            pageSize: 15,
            filtering: true,
            pageButtonCount: 5,
            paging: true,
            sorting: true,
            selecting: true,
            editing: false,
            autoload: true,
            noDataContent: "No Records Found",
            loadMessage: "Please, wait...",
        }, self.tableConfig);

        // @ts-ignore
        if (self.tableConfig?.tableController) {
            // @ts-ignore
            jsGridObj.controller = {
                loadData: function (filter: any) {
                    // @ts-ignore
                    return self.tableConfig.tableController.filterGridRows(self.tableConfig.data, filter)
                },
            }
            jsGridObj.filtering = true
        } else {
            jsGridObj.filtering = false;
        }

        console.log("after", self.tableConfig)
        $("#jsGrid").jsGrid(jsGridObj);
    }
}
