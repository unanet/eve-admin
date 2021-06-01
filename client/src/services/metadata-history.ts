import {FormFieldType} from "@/components/Form/FormProps";
import {apiService, APIType} from "@/utils/APIType";
import {getDefaultIDColumnSize, getFormFields, getJSTableHeaders} from "@/utils/helpers";

// Metadata history is a one off since we don't want the typical CRUD actions on it
const metadataHistoryService = new class {
    public baseUrl = "/metadata-history"
    public fieldDeclarations = {
        metadata_id: {
            title: "Metadata ID",
            type: FormFieldType.number,
            width: getDefaultIDColumnSize()
        },
        description: {
            title: "Description",
        },
        value: {
            title: "Value",
            type: FormFieldType.json,
            placeholder: {}
        },
        created: {
            title: "Created",
            type: FormFieldType.datetime,
        },
        created_by: {
            title: "Created By"
        },
        deleted: {
            title: "Deleted",
            type: FormFieldType.datetime,
        },
        deleted_by: {
            title: "Deleted By"
        }
    }
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

    get() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then(response => {
            return response.data
        }).catch(err => {
            return err;
        });
    }
}

export {metadataHistoryService}