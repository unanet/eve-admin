import {FormFieldType} from "@/components/Form/FormProps";
import {mappingModelFields} from "@/models";
import {
    generateID,
    getDefaultIDColumnSize,
} from "@/utils/helpers";
import {BaseService} from "./";
import {apiService, APIType, APIResponse} from "@/utils/APIType";

const metadataServiceMapService = new class extends BaseService {
    baseUrl = "/metadata/service-maps"
    fieldDeclarations = {
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "env:una-dev",
        },
        metadata_id: {
            title: "Metadata ID",
            type: FormFieldType.number,
            placeholder: generateID(1,200),
            width: getDefaultIDColumnSize()
        },
        ...mappingModelFields,
        service_id: {
            title: "Service ID",
            type: FormFieldType.number,
            placeholder: null,
            width: getDefaultIDColumnSize(),
            nullable: true
        },
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, this.baseUrl, data).then((response: APIResponse) => {
            return response.data
        });
    }

    create(data: any) {
        return apiService.postRequest(APIType.EVE, this.baseUrl, data).then((response: APIResponse) => {
            return response.data
        });
    }

    delete(data: any) {
        return apiService.deleteRequest(APIType.EVE, this.baseUrl, data).then((response: APIResponse) => {
            return response.data
        });
    }

    getLayers(id: number) {
        return apiService.getRequest(APIType.EVE, `/services/${id}/metadata-maps`).then((response: APIResponse) => {
           return response.data
        });
    }
}

export {metadataServiceMapService}
