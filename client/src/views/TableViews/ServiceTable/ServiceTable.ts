import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";
import {serviceService as service} from "@/services";

export default NewTableBaseView("Service", service, {
    mixin: {
        data() {
            return {
                // Needed for how vue does mixins of objects
                showMetadataLayerLink: true,
                showDefinitionLayerLink: false,
                layeringModelType: "service",
            }
        }
    },
})
