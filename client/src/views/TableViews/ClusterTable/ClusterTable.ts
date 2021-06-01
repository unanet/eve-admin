import {clusterService as service} from "@/services";
import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";

export default NewTableBaseView("Cluster", service, {
    mixin: {
        data() {
            return {
                // Needed for how vue does mixins of objects
                extraConfig: {
                    createNewItemConfig: {
                        hiddenFields: [
                            "created_at",
                            "updated_at",
                        ]
                    }
                }
            }
        }
    }
})
