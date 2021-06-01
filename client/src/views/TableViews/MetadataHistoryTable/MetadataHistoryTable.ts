import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";
import {metadataHistoryService as service} from "@/services";

export default NewTableBaseView("Metadata History", service, {
    modelIDField: "metadata_id",
    mixin: {
        data() {
            return {
                disableCreate: true,
                // This will overwrite the entire formConfig object in our form
                formConfig: {
                    disableActions: true,
                    editItemConfig: {
                        disabledFields: [
                            "metadata_id",
                            "description",
                            "value",
                            "created",
                            "created_by",
                            "deleted",
                            "deleted_by",
                        ],
                        hiddenFields: []
                    }
                }
            }
        }
    }
})
