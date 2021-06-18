import {clusterService as service} from "@/services";
import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";

export default NewTableBaseView("Cluster", service, {
    mixin: {
        data() {
            return {
                showMetadataLayerLink: true,
                layeringModelType: "cluster",
                // Needed for how vue does mixins of objects
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
