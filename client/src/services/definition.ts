import {FormFieldType} from "@/components/Form/FormProps";
import {dateTimeFields, idField} from "@/models";
import {generateID, getDefaultIDColumnSize} from "@/utils/helpers";
import {BaseService} from "./";
import {apiService, APIType} from "@/utils/APIType";

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
        definition_type_id: {
            title: "Definition Type ID",
            type: FormFieldType.number,
            placeholder: generateID(),
            width: getDefaultIDColumnSize()
        },
        data: {
            title: "Data",
            type: FormFieldType.json,
            placeholder: {"spec": {"template": {"spec": {"serviceAccountName": "eve-sch"}}}}
        },
        ...dateTimeFields
    }

    create(data: any) {
        return apiService.putRequest(APIType.EVE, this.baseUrl, data).then(response => {
            return response.data
        });
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, this.baseUrl, data).then(response => {
            return response.data
        });
    }

}

export {definitionService}

