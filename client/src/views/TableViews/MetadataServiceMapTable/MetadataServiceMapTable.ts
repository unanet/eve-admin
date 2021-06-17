import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";
import {metadataServiceMapService as service} from "@/services";

export default NewTableBaseView("Metadata Service Map", service, {
    modelIDField: "description",
    mixin: {
        data() {
            return {
                getDataFunction: "getTableData",
                // Needed for how vue does mixins of objects
                extraConfig: {
                    editItemConfig: {
                        disabledFields: [
                            "description"
                        ]
                    }
                }
            }
        }
    }
})
