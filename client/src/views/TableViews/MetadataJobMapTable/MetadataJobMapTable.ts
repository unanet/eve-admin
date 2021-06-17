import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";
import {metadataJobMapService as service} from "@/services";

export default NewTableBaseView("Metadata Job Map", service, {
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
