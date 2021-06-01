import axios, {AxiosResponse} from "axios";
import config from "@/config";

enum HTTPMethod {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE"
}

class APIResponse {
    data: object = {};
    error: string = "";
}

enum APIType {
    EVE = "EVE",
    CLOUD = "CLOUD"
}

const apiService = new class API {
    API_URL: string
    constructor(API_URL = config.API_URL) {
        this.API_URL = API_URL;
    }

    getAPIURL(apiType: APIType) {
        let apiPrefix: string

        switch(apiType) {
            case APIType.EVE: {
                apiPrefix = "/eve";
                break;
            }
            case APIType.CLOUD: {
                apiPrefix = "/cloud";
                break;
            }
        }

        return `${this.API_URL}${apiPrefix}`;
    }

    async makeAPIRequest(apiType: APIType, method: HTTPMethod, path: string, headers?: {}, body?: {}): Promise<APIResponse> {

        let apiCall: any

        switch (method) {
            case HTTPMethod.GET:
                apiCall = axios.get(`${this.getAPIURL(apiType)}${path}`)
                break;
            case HTTPMethod.PUT:
                apiCall = axios.put(`${this.getAPIURL(apiType)}${path}`, body)
                break;
            case HTTPMethod.POST:
                apiCall = axios.post(`${this.getAPIURL(apiType)}${path}`, body)
                break;
            case HTTPMethod.DELETE:
                // Axios call does not allow body content for a delete request
                apiCall = axios.delete(`${this.getAPIURL(apiType)}${path}`, { data: body });
                break;
        }

        const apiResponse = new APIResponse()

        return new Promise((resolve, reject) => {
            apiCall.then((response: AxiosResponse) => {
                // JSON responses are automatically parsed.
                apiResponse.data = response.data
                resolve(apiResponse)
            }).catch((e: any) => {
                console.error(e)
                apiResponse.error = "Error from the API, unable to perform this action, please try again later."
                reject(apiResponse)
            });
        })
    }

    // In the future we can make these methods private and export eveGetRequest, evePostRequest, cloudGetRequest, etc courier methods
    // This will help us clean up the code and not have to pass in an enum to the request handler

    getRequest(apiType: APIType, path: string, headers?: {}): Promise<APIResponse> {
        return this.makeAPIRequest(apiType, HTTPMethod.GET, path, headers)
    }

    putRequest(apiType: APIType, path: string, data: any, headers?: {}): Promise<APIResponse> {
        return this.makeAPIRequest(apiType, HTTPMethod.PUT, path, headers, data)
    }

    postRequest(apiType: APIType, path: string, data: any, headers?: {}): Promise<APIResponse> {
        return this.makeAPIRequest(apiType, HTTPMethod.POST, path, headers, data)
    }

    deleteRequest(apiType: APIType, path: string, data: any, headers?: {}): Promise<APIResponse> {
        return this.makeAPIRequest(apiType, HTTPMethod.DELETE, path, headers, data)
    }
}

export {APIResponse, apiService, APIType}
