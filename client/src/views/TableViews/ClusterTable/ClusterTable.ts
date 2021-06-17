import {clusterService as service} from "@/services";
import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";

export default NewTableBaseView("Cluster", service, {
    mixin: {
        data() {
            return {
                // Needed for how vue does mixins of objects
                showMetadataLayerLink: true,
                layeringModelType: "cluster",
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
