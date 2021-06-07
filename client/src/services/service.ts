import {FormFieldType} from "@/components/Form/FormProps";
import {dateTimeFields, idField, INamespace} from "@/models";
import {
    generateID,
    getDefaultIDColumnSize,
    shouldShowRowNumbersMatch,
    shouldShowRowStringsMatch
} from "@/utils/helpers";
import {BaseService} from "./";

const serviceService = new class extends BaseService {
    baseUrl = "/services"
    fieldDeclarations = {
        ...idField,
        name: {
            title: "Name",
            type: FormFieldType.text,
            placeholder: "platform",
        },
        namespace_id: {
            title: "Namespace",
            type: FormFieldType.number,
            placeholder: generateID(),
            width: getDefaultIDColumnSize(),
        },
        artifact_id: {
            title: "Artifact",
            type: FormFieldType.number,
            placeholder: generateID(),
        },
        override_version: {
            title: "Override Version",
            type: FormFieldType.text,
            placeholder: "0.1",
        },
        deployed_version: {
            title: "Deployed Version",
            type: FormFieldType.text,
            placeholder: "0.1.0.1",
        },
        count: {
            title: "Count",
            type: FormFieldType.number,
            placeholder: generateID(1,4),
        },
        explicit_deploy: {
            title: "Explicit Deploy",
            type: FormFieldType.checkbox,
            placeholder: false,
            filtering: false
        },
        success_exit_codes: {
            title: "Success Exit Codes",
            type: FormFieldType.text,
            placeholder: "0",
            filtering: false
        },
        ...dateTimeFields
    }
}

export {serviceService}
