import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import config from "@/config";
import store from "@/store";
import {getAuthToken, clearAuthTokens} from "@/utils/auth";

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
    API = "API",
    EVE = "EVE",
    CLOUD = "CLOUD"
}

const apiService = new class API {
    API_URL: string
    http: any
    constructor(API_URL = config.API_URL) {
        this.API_URL = API_URL;
        this.http = axios.create()
        this.addInterceptor()
    }

    addInterceptor() {
        this.http.interceptors.request.use((config: AxiosRequestConfig) => {
            // Add our auth header if we have it in local storage
            const auth_token = getAuthToken();
            if (auth_token) {
                config.headers.common['Authorization'] = "BEARER " + auth_token;
            }

            return config
        });

        this.http.interceptors.response.use((response: AxiosResponse) => {
            // True up our API response status codes
            if (response.data != "") {
                response.status = response.data.code;
            }

            if (response.data.code == 401) {
                clearAuthTokens()
            }

            return response
        })
    }

    getAPIURL(apiType: APIType) {
        let apiPrefix: string

        switch(apiType) {
            case APIType.API: {
                apiPrefix = "/";
                break;
            }
            case APIType.EVE: {
                apiPrefix = "/eve";
                break;
            }
            case APIType.CLOUD: {
                apiPrefix = "/api";
                break;
            }
        }

        return `${this.API_URL}${apiPrefix}`;
    }

    async makeAPIRequest(apiType: APIType, method: HTTPMethod, path: string, headers?: {}, body?: {}, params?: {}): Promise<APIResponse> {

        let apiCall: any

        switch (method) {
            case HTTPMethod.GET:
                apiCall = this.http.get(`${this.getAPIURL(apiType)}${path}`, {
                    params
                })
                break;
            case HTTPMethod.PUT:
                apiCall = this.http.put(`${this.getAPIURL(apiType)}${path}`, body)
                break;
            case HTTPMethod.POST:
                apiCall = this.http.post(`${this.getAPIURL(apiType)}${path}`, body)
                break;
            case HTTPMethod.DELETE:
                // Axios call does not allow body content for a delete request
                apiCall = this.http.delete(`${this.getAPIURL(apiType)}${path}`, { data: body });
                break;
        }

        const apiResponse = new APIResponse()

        // @ts-ignore ignore promise, resolve and reject declarations
        return new Promise((resolve, reject) => {
            apiCall.then((response: AxiosResponse) => {
                // JSON responses are automatically parsed.
                apiResponse.data = response.data

                // Special interceptor
                switch (response.data.code) {
                    case 401:
                        response.data.code = 401;
                        (store as Record<string, any>).commit('isLoggedIn', false)
                        return reject(response.data)
                }

                if (response.data.code < 199 || response.data.code > 399) {
                    return reject(response.data)
                }

                (store as Record<string, any>).commit('isLoggedIn', true)

                resolve(apiResponse)
            }).catch((e: AxiosError) => {

                if (e.request._isRedirect) {
                    // If we are in a redirect, resolve the redirect
                    return resolve(axios.request({
                        url: e.request._options.path
                    }));
                }

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

export {APIResponse, apiService, APIType, HTTPMethod}
