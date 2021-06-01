import {FormFieldType} from "@/components/Form/FormProps";
import {dateTimeFields, mappingModelFields} from "@/models";
import {generateID, getDefaultIDColumnSize} from "@/utils/helpers";
import {BaseService} from "./";
import {apiService, APIType} from "@/utils/APIType";

const metadataJobMapService = new class extends BaseService {
    baseUrl = "/metadata/job-maps"
    fieldDeclarations = {
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "cluster:devops-prod",
        },
        metadata_id: {
            title: "Metadata ID",
            type: FormFieldType.number,
            placeholder: generateID(1,200),
            width: getDefaultIDColumnSize()
        },
        ...mappingModelFields,
        job_id: {
            title: "Job ID",
            type: FormFieldType.number,
            placeholder: null,
            width: getDefaultIDColumnSize(),
            nullable: true
        },
       ...dateTimeFields
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, this.baseUrl, data).then(response => {
            return response.data
        });
    }

    create(data: any) {
        return apiService.postRequest(APIType.EVE, this.baseUrl, data).then(response => {
            return response.data
        });
    }

    delete(data: any) {
        return apiService.deleteRequest(APIType.EVE, this.baseUrl, data).then(response => {
            return response.data
        });
    }
}

export {metadataJobMapService}
