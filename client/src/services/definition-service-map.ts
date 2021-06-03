import {FormFieldType} from "@/components/Form/FormProps";
import {mappingModelFields} from "@/models";
import {generateID, getDefaultIDColumnSize} from "@/utils/helpers";
import {BaseService} from "./";
import {APIResponse, apiService, APIType} from "@/utils/APIType";

const definitionServiceMapService = new class extends BaseService {
    baseUrl = "/definitions/service-maps"
    fieldDeclarations = {
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "resource:base",
        },
        definition_id: {
            title: "Definition ID",
            type: FormFieldType.number,
            placeholder: generateID(),
            width: getDefaultIDColumnSize()
        },
        service_id: {
            title: "Service ID",
            type: FormFieldType.number,
            placeholder: null,
            width: getDefaultIDColumnSize()
        },
        ...mappingModelFields
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, `/definitions/${data.definition_id}/service-maps`, data).then((response: APIResponse) => {
            return response.data
        });
    }

    delete(data: any) {
        return apiService.deleteRequest(APIType.EVE, `/definitions/${data.definition_id}/service-maps/${data.desc}`, data).then((response: APIResponse) => {
            return response.data
        });
    }
}

export {definitionServiceMapService}
