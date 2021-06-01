import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";
import {metadataService as service} from "@/services";

export default NewTableBaseView("Metadata", service, {
    mixin: {
        data() {
            return {
                // Needed for how vue does mixins of objects
                extraConfig: {
                    editItemConfig: {
                        disabledFields: [
                            "id",
                            "description",
                            "created_at",
                            "updated_at"
                        ]
                    }
                }
            }
        }
    }
})
