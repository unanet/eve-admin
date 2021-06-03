import {FormFieldType} from "@/components/Form/FormProps";
import {BaseService} from "./";
import {generateID, getDefaultIDColumnSize} from "@/utils/helpers";
import {APIResponse, apiService, APIType} from "@/utils/APIType";

const environmentFeedMapService = new class extends BaseService {
    baseUrl = "/environment-feed-maps"
    fieldDeclarations = {
        environment_id: {
            title: "Environment ID",
            type: FormFieldType.number,
            placeholder: generateID(),
            width: getDefaultIDColumnSize()
        },
        feed_id: {
            title: "Feed ID",
            type: FormFieldType.number,
            placeholder: generateID(1, 5),
            width: getDefaultIDColumnSize()
        },
    }

    get() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then((response: APIResponse) => {
            return response.data
        });
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
}

export {environmentFeedMapService}
