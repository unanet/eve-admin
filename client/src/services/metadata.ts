import {FormFieldType} from "@/components/Form/FormProps";
import {dateTimeFields, idField, IJob, IMetadata} from "@/models";
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

    getMappings() {
        return this.get().then(models => {
            return Object.fromEntries((models as IMetadata[]).map((item: IMetadata) => [item.id, item.description]))
        });
    }

    create(data: any) {
        console.error("metadata create needs to be built");
        return apiService.putRequest(APIType.EVE, this.baseUrl, data).then((response: APIResponse) => response.data);
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, `${this.baseUrl}`, data).then((response: APIResponse) => response.data);
    }

    delete(data: any) {
        return apiService.deleteRequest(APIType.EVE, `${this.baseUrl}/${data.id}`, data).then((response: APIResponse) => response.data);
    }
}

export {metadataService}
