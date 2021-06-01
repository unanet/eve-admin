import {idField, dateTimeFields} from "@/models";
import {generateID, getDefaultIDColumnSize} from "@/utils/helpers";
import {FormFieldType} from "@/components/Form/FormProps";
import {BaseService} from "./base";
import {apiService} from "@/utils/APIType";

const jobService = new class extends BaseService {
    baseUrl = "/jobs"
    fieldDeclarations = {
        ...idField,
        name: {
            title: "Name",
            type: FormFieldType.text,
            placeholder: "foo-job",
        },
        artifact_id: {
            title: "Artifact",
            type: FormFieldType.number,
            placeholder: generateID(),
            width: getDefaultIDColumnSize()
        },
        namespace_id: {
            title: "Namespace",
            type: FormFieldType.number,
            placeholder: generateID(1,200),
            width: 75
        },
        override_version: {
            title: "Override Version",
            type: FormFieldType.text,
            placeholder: "20.3.0.13",
        },
        deployed_version: {
            title: "Deployed Version",
            type: FormFieldType.text,
            placeholder: "0.1.0.1",
        },
        success_exit_codes: {
            title: "Success Exit Codes",
            type: FormFieldType.text,
            placeholder: "0",
            width: 100
        },
        explicit_deploy: {
            title: "Explicit Deploy",
            type: FormFieldType.checkbox,
            placeholder: false,
            width: 75
        },
        ...dateTimeFields
    }
}

export {jobService}
