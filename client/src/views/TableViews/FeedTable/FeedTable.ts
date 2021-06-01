import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";
import {feedService as service} from "@/services";

export default NewTableBaseView("Feed", service, {
    mixin: {
        data() {
            return {
                // Needed for how vue does mixins of objects
                extraConfig: {
                    createNewItemConfig: {
                        hiddenFields: [
                            "" // Show All
                        ]
                    },
                    editItemConfig: {
                        disabledFields: [
                            "id"
                        ]
                    }
                }
            }
        }
    }
})
