import {clusterService as service} from "@/services";
import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";

export default NewTableBaseView("Cluster", service, {
    mixin: {
        data() {
            return {
                // tableConfig: {
                //     extraFields: [
                //         {
                //             name: "Layering", headercss: "layering-control jsgrid-align-left", type: "metadata-control-field"
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
