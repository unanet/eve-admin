import {FormFieldType} from "@/components/Form/FormProps";
import {
    dateTimeFields,
    formatTableField,
    generateTableFields, ICluster,
    IDefinition,
    IDefinitionType,
    idField,
    IService
} from "@/models";
import {generateID, getDefaultIDColumnSize} from "@/utils/helpers";
import {BaseService, definitionTypeService} from "./";
import {APIResponse, apiService, APIType} from "@/utils/APIType";

const definitionService = new class extends BaseService {
    baseUrl = "/definitions"
    fieldDeclarations = {
        ...idField,
        id: {
            title: "ID",
            type: FormFieldType.number,
            placeholder: generateID(),
            width: getDefaultIDColumnSize()
        },
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "deployment:serviceAccount:eve-sch"
        },
        ...generateTableFields("Definition Type", "definition_type"),
        data: {
            title: "Data",
            type: FormFieldType.json,
            placeholder: {"spec": {"template": {"spec": {"serviceAccountName": "eve-sch"}}}}
        },
        ...dateTimeFields
    }

    create(data: any) {
        return apiService.putRequest(APIType.EVE, this.baseUrl, data).then((response: APIResponse) => {
            return response.data
        });
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, this.baseUrl, data).then((response: APIResponse) => {
            return response.data
        });
    }

    getMappings() {
        return this.get().then(definitions => {
            return Object.fromEntries((definitions as IDefinition[]).map((item: IDefinition) => [item.id, item.description]))
        });
    }

    getTableData() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then((response: APIResponse) => {

            return definitionTypeService.getMappings().then(definitionTypeMap => {

                return (response.data as IDefinition[]).map((definition: IDefinition) => {
                    definition.definition_type_name = formatTableField(definitionTypeMap[definition.definition_type_id], definition.definition_type_id)
                    return definition
                });
            });
        });
    }
}

export {definitionService}

