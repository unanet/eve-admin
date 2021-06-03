import {FormFieldType} from "@/components/Form/FormProps";
import {dateTimeFields, idField} from "@/models";
import {BaseService} from "./";
import {APIResponse, apiService, APIType} from "@/utils/APIType";

const metadataService = new class extends BaseService {
    baseUrl = "/metadata"
    fieldDeclarations = {
        ...idField,
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "art:unanet-proxy"
        },
        value: {
            title: "Value",
            type: FormFieldType.json,
            placeholder: {"EVE_LOG_LEVEL": "debug", "PROXY_DEV_MODE": "false", "EVE_SERVICE_NAME": "unanet-proxy", "PROXY_SYNC_TIMER": "30s", "PROXY_USE_KUBERNETES_REG": "true"}
        },
        ...dateTimeFields
    }

    create(data: any) {
        console.error("metadata create needs to be built");
        return apiService.putRequest(APIType.EVE, this.baseUrl, data).then((response: APIResponse) => {
            return response.data
        });
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, `${this.baseUrl}`, data).then((response: APIResponse) => {
            return response.data
        });
    }

    delete(data: any) {
        return apiService.deleteRequest(APIType.EVE, `${this.baseUrl}/${data.id}`, data).then((response: APIResponse) => {
            return response.data
        });
    }
}

export {metadataService}
