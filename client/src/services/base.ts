import {
    generateID,
    getFormFields,
    getJSTableHeaders,
    shouldShowRowNumbersMatch,
    shouldShowRowStringsMatch
} from "@/utils/helpers";
import {APIResponse, apiService, APIType} from "@/utils/APIType";

const BaseService = class {
    public baseUrl = "/"
    public fieldDeclarations = {}
    private parsedTableSearchParams: Record<string,any>|null = null;

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
        return apiService.postRequest(APIType.EVE, this.baseUrl, data).then((response: APIResponse) => {
            return response.data
        });
    }

    get() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then((response: APIResponse) => {
            return response.data
        });
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, `${this.baseUrl}/${data.id}`, data).then((response: APIResponse) => {
            return response.data
        });
    }

    delete(data: any) {
        return apiService.deleteRequest(APIType.EVE, `${this.baseUrl}/${data.id}`, data).then((response: APIResponse) => {
            return response.data
        });
    }

    getLayers(model: string, id: number, type: string) {
        return apiService.getRequest(APIType.EVE, `/${model}/${id}/${type}-maps`).then((response: APIResponse) => {
            return response.data
        });
    }

    tableController = {
        filterGridRows: (rows: any[], filter: any) => {
            // Check / cache our parsed values
            if (this.parsedTableSearchParams == null) {
                const tableHeaders = this.getJSTableHeaders();

                this.parsedTableSearchParams = {
                    numbers: [],
                    strings: [],
                    emptyCheck: []
                };

                for (const key in tableHeaders) {
                    // @ts-ignore
                    const field = tableHeaders[key] as Record<string, any>

                    // @ts-ignore
                    if (field.filtering != false) {
                        if (field.type === "number") {
                            this.parsedTableSearchParams.numbers.push(field.name)
                            this.parsedTableSearchParams.emptyCheck.push((value: number|undefined) => {
                                return value == undefined;
                            })
                        } else if (field.type === "text") {
                            this.parsedTableSearchParams.strings.push(field.name)
                            this.parsedTableSearchParams.emptyCheck.push((value: string|"") => {
                                return value == "";
                            })
                        }
                    }
                }
            }

            const isEmptyNumberSearch = this.parsedTableSearchParams.numbers.length == 0 || this.parsedTableSearchParams.numbers.every((key: string) => {
                  return filter[key] == undefined
            })

            const isEmptyStringSearch = this.parsedTableSearchParams.numbers.strings == 0 || this.parsedTableSearchParams.strings.every((key: string) => {
                return filter[key] == ""
            })

            // Check to see if we are in a clean filter state
            if (isEmptyNumberSearch && isEmptyStringSearch) {
                return rows;
            }

            return rows.filter(row => {

                return (
                    // @ts-ignore suppress this.parsedTableSearchParams being potentially null
                    shouldShowRowStringsMatch(row, filter, this.parsedTableSearchParams.strings) || shouldShowRowNumbersMatch(row, filter, this.parsedTableSearchParams.numbers)
                )
            })
        }
    }
}

export {generateID, BaseService}
