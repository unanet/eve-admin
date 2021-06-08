import {clusterService as service} from "@/services";
import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";

export default NewTableBaseView("Cluster", service, {
    mixin: {
        data() {
            return {
                // tableConfig: {
                //     extraFields: [
                //         {
                //             type: "layering-control"
                //         }
                //     ]
                // },
                createNewItemConfig: {
                    hiddenFields: [
                        "created_at",
                        "updated_at",
                    ]
                }
            }
        }
    }
})
