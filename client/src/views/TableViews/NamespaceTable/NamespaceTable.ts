import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";
import {namespaceService as service} from "@/services";

export default NewTableBaseView("Namespace", service, {
    mixin: {
        data() {
            return {
                showMetadataLayerLink: true,
                layeringModelType: "namespace",
            }
        }
    }
})
