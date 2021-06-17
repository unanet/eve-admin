import {FormFieldType} from "@/components/Form/FormProps";
import {generateID} from "@/utils/helpers";
import {BaseService} from "./";
import {dateTimeFields, formatTableField, ICluster, idField, IService} from "@/models";
import {APIResponse, apiService, APIType} from "@/utils/APIType";
import {generateTableFields} from "@/models/tableFields";

const serviceService = new class extends BaseService {
    baseUrl = "/services"
    fieldDeclarations = {
        ...idField,
        name: {
            title: "Name",
            type: FormFieldType.text,
            placeholder: "platform",
        },
        ...generateTableFields("Namespace", "namespace"),
        ...generateTableFields("Artifact", "artifact"),
        override_version: {
            title: "Override Version",
            type: FormFieldType.text,
            placeholder: "0.1"
        },
        deployed_version: {
            title: "Deployed Version",
            type: FormFieldType.text,
            placeholder: "0.1.0.1",
        },
        count: {
            title: "Count",
            type: FormFieldType.number,
            placeholder: generateID(1, 4),
        },
        explicit_deploy: {
            title: "Explicit Deploy",
            type: FormFieldType.checkbox,
            placeholder: false,
            filtering: false,
            hideInTable: true
        },
        success_exit_codes: {
            title: "Success Exit Codes",
            type: FormFieldType.text,
            placeholder: "0",
            width: 100,
            hideInTable: true,
            filtering: false
        },
        ...dateTimeFields
    }

    getMappings() {
        return this.get().then(models => {
            return Object.fromEntries((models as IService[]).map((item: IService) => [item.id, item.name]))
        });
    }

    get() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then((response: APIResponse) => {
            return (response.data as IService[]).map((service: IService) => {
                service.artifact_name = formatTableField(service.artifact_name, service.artifact_id)
                service.namespace_name = formatTableField(service.namespace_name, service.namespace_id)
                return service
            });
        });
    }
}

export {serviceService}
