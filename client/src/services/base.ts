import {generateID, getFormFields, getJSTableHeaders} from "@/utils/helpers";
import {apiService, APIType} from "@/utils/APIType";

const BaseService = class {
    public baseUrl = "/"
    public fieldDeclarations = {}
    constructor() {}
    getJSTableHeaders() {
        return getJSTableHeaders(this.fieldDeclarations)
    }

    getFormFields(obj?: {}) {
        return getFormFields(this.fieldDeclarations, obj)
    }

    getEmptyModel() {
        return {}
    }

    create(data: any) {
        return apiService.postRequest(APIType.EVE, this.baseUrl, data).then(response => {
            return response.data
        });
    }

    get() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then(response => {
            return response.data
        });
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, `${this.baseUrl}/${data.id}`, data).then(response => {
            return response.data
        });
    }

    delete(data: any) {
        return apiService.deleteRequest(APIType.EVE, `${this.baseUrl}/${data.id}`, data).then(response => {
            return response.data
        });
    }
}

export {generateID, BaseService}
