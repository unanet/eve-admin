import {FormFieldType} from "@/components/Form/FormProps";
import {dateTimeFields, idField} from "@/models";
import {generateID, getDefaultIDColumnSize} from "@/utils/helpers";
import {BaseService} from "./";
import {apiService} from "@/utils/APIType";

const namespaceService = new class extends BaseService {
    baseUrl = "/namespaces"
    fieldDeclarations = {
        ...idField,
        name: {
            title: "Name",
            type: FormFieldType.text,
            placeholder: "una-dev-current"
        },
        alias: {
            title: "Alias",
            type: FormFieldType.text,
            placeholder: "current"
        },
        environment_id: {
            title: "Environment ID",
            type: FormFieldType.number,
            placeholder: generateID(),
            width: getDefaultIDColumnSize()
        },
        requested_version: {
            title: "Requested Version",
            type: FormFieldType.text,
            placeholder: "20.7"
        },
        explicit_deploy: {
            title: "Explicit Version",
            type: FormFieldType.checkbox,
            placeholder: false,
            width: getDefaultIDColumnSize()
        },
        cluster_id: {
            title: "Cluster ID",
            type: FormFieldType.number,
            placeholder: generateID()
        },
        ...dateTimeFields,
    }
}

export {namespaceService}
