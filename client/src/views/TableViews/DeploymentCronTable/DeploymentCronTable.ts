import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";
import {deploymentCronService as service} from "@/services";

export default NewTableBaseView("Deployment Cron", service, {
    mixin: {
        data() {
            return {
                // Needed for how vue does mixins of objects
                extraConfig: {
                    createNewItemConfig: {
                        hiddenFields: [
                            "id",
                            "state",
                            "last_run"
                        ]
                    },
                    editItemConfig: {
                        disabledFields: [
                            "id",
                            "state",
                            "last_run"
                        ]
                    }
                }
            }
        }
    }
})
