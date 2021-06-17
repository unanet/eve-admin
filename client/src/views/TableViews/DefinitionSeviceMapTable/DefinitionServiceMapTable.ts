import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";
import {definitionServiceMapService as service} from "@/services";

export default NewTableBaseView("Definition Service Map", service, {
    modelIDField: "description",
    mixin: {
        data() {
            return {
                getDataFunction: "getTableData"
            }
        }
    }
})
