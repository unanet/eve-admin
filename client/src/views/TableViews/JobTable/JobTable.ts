import {NewTableBaseView} from "../_TableBaseView/_TableBaseView";
import {jobService as service} from "@/services";

export default NewTableBaseView("Job", service, {
    mixin: {
        data() {
            return {
                // Needed for how vue does mixins of objects
                extraConfig: {
                    editItemConfig: {
                        disabledFields: [
                            "id",
                            "created_at",
                            "updated_at"
                        ]
                    }
                }
            }
        }
    }
})
