import {definitionJobMapService as service} from "@/services";
import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";

export default NewTableBaseView("Definition Job Map", service, {
    modelIDField: "description",
    mixin: {
        data() {
            return {
                getDataFunction: "getTableData"
            }
        }
    }
})
