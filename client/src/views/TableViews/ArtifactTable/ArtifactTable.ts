import {artifactService as service} from "@/services";
import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";

export default NewTableBaseView("Artifact", service, {
    modelIDField: "name",
    mixin: {
        data() {
            return {
                showMetadataLayerLink: true,
                layeringModelType: "artifact",
                // Needed for how vue does mixins of objects
                extraConfig: {
                    createNewItemConfig: {
                        hiddenFields: [
                            "" // Show All
                        ]
                    },
                }
            }
        }
    }
})
