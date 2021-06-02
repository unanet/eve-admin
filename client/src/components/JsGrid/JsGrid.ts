import {IJSGridHeaderData, IJSGridOptions, JSGridProps} from "./JSGridProps";
import {JSONField, DateTimeField} from "./fields";
// Import JSGrid Lib files
import "./third-party/jsgrid/jsgrid.min.js"
import {FormFieldType} from "@/components/Form/FormProps";

declare const $: any;
declare let jsGrid: any;

export default {
    name: 'JsGrid',
    props: {
        tableConfig: Object as () => JSGridProps,
    },
    mounted() {
        const self = this as any

        // Register fields
        jsGrid.fields.json = JSONField(jsGrid);
        jsGrid.fields[FormFieldType.datetime] = DateTimeField(jsGrid);

        const tableConfig = Object.assign(new JSGridProps(), self.tableConfig as JSGridProps);

        if (tableConfig.tableID != "jsGrid") {
            console.log("table id is currently not supported")
            tableConfig.tableID = "jsGrid"
        }

        let fields = tableConfig.headers as IJSGridHeaderData[];

        // If we enable editing, let's show the edit column
        if (tableConfig.editing) {
            fields = fields.concat([{ name:"controls", type: "control"}])
        }

        // https://www.npmjs.com/package/jsgrid#configuration
        let jsGridObj = {
            // controller: {
            //     loadData: $.noop,
            //     insertItem: $.noop,
            //     updateItem: $.noop,
            //     deleteItem: $.noop
            // },
            height: tableConfig.height,
            width: tableConfig.width,
            sorting: tableConfig.sorting,
            paging: tableConfig.paging,
            selecting: tableConfig.selecting,
            filtering: tableConfig.filtering,
            editing: tableConfig.editing,
            // aftersavefunc: function (rowid: any, response:any) { console.log(rowid, response) },
            // errorfunc: function (rowid:any, response:any) { console.log(rowid, response); },
            confirmDeleting: false,
            data: tableConfig.rows as [],
            fields,
            noDataContent: "No Records Found",
            loadMessage: "Please, wait...",
        } as IJSGridOptions;

        if (tableConfig.rowClick) {
            jsGridObj.rowClick = tableConfig.rowClick;
        }

        $(`#${tableConfig.tableID}`).jsGrid(jsGridObj);
    },
}
