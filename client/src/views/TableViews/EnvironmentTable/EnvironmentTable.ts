import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";
import {environmentService as service} from "@/services";

export default NewTableBaseView("Environment", service, {
    mixin: {
        data() {
            return {
                // Needed for how vue does mixins of objects
                extraConfig: {
                    createNewItemConfig: {
                        hiddenFields: [
                            "updated_at",
                        ]
                    },
                    editItemConfig: {
                        disabledFields: [
                            "id",
                            "name",
                            "alias",
                            "updated_at",
                        ]
                    }
                }
            }
        }
    }
})
