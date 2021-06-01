import {definitionService as service} from "@/services";
import {NewTableBaseView} from "@/views/TableViews/_TableBaseView/_TableBaseView"

export default NewTableBaseView("Definition", service, {
    mixin: {
        data() {
            return {
                // Needed for how vue does mixins of objects
                extraConfig: {
                    editItemConfig: {
                        disabledFields: [
                            "id",
                            "description",
                            "updated_at",
                            "created_at"
                        ]
                    }
                }
            }
        }
    }
})
