import {FormFieldType} from "@/components/Form/FormProps";
import {dateTimeFields, mappingModelFields} from "@/models";
import {generateID, getDefaultIDColumnSize} from "@/utils/helpers";
import {BaseService} from "./";
import {apiService, APIType} from "@/utils/APIType";

const definitionJobMapService = new class extends BaseService {
    baseUrl = "/definitions/job-maps"
    fieldDeclarations = {
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "job:ttl",
        },
        definition_id: {
            title: "Definition ID",
            type: FormFieldType.number,
            placeholder: generateID(),
            width: getDefaultIDColumnSize()
        },
        job_id: {
            title: "Job ID",
            type: FormFieldType.number,
            placeholder: null,
            width: getDefaultIDColumnSize()
        },
        ...mappingModelFields,
        ...dateTimeFields
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, `/definitions/${data.definition_id}/job-maps`, data).then(response => {
            return response.data
        });
    }
    delete(data: any) {
        return apiService.deleteRequest(APIType.EVE, `/definitions/${data.definition_id}/job-maps/${data.description}`, data).then(response => {
            return response.data
        });
    }
}

export {definitionJobMapService}
