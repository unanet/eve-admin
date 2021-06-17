import {FormFieldType} from "@/components/Form/FormProps";
import {dateTimeFields, formatTableField, generateTableFields, IDefinitionJobMap, mappingModelFields} from "@/models";
import {artifactService, BaseService, clusterService, definitionService, environmentService, jobService} from "./";
import {APIResponse, apiService, APIType} from "@/utils/APIType";

const definitionJobMapService = new class extends BaseService {
    baseUrl = "/definitions/job-maps"
    fieldDeclarations = {
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "job:ttl",
        },
        ...generateTableFields("Definition", "definition"),
        ...generateTableFields("Job", "job"),
        ...mappingModelFields,
        ...dateTimeFields
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, `/definitions/${data.definition_id}/job-maps`, data).then((response: APIResponse) => {
            return response.data
        });
    }

    delete(data: any) {
        return apiService.deleteRequest(APIType.EVE, `/definitions/${data.definition_id}/job-maps/${data.description}`, data).then((response: APIResponse) => {
            return response.data
        });
    }

    // getLayers(id: number) {
    //     return apiService.getRequest(APIType.EVE, `/jobs/${id}/definition-maps`).then((response: APIResponse) => {
    //         return response.data
    //     });
    // }

    getTableData() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then((response: APIResponse) => {

            const rows = response.data as IDefinitionJobMap[];
            return Promise.all([
                definitionService.getMappings(),
                jobService.getMappings(),
                environmentService.getMappings(),
                artifactService.getMappings(),
                clusterService.getMappings()
            ]).then((mappings) => {
                const [definitionMappings, jobMappings, environmentMappings, artifactMappings, clusterMappings] = mappings;

                return rows.map(row => {
                    if (row.definition_id != 0) {
                        row.definition_name = formatTableField(definitionMappings[row.definition_id], row.definition_id)
                    }

                    if (row.job_id && row.job_id != 0) {
                        row.job_name = formatTableField(jobMappings[row.job_id], row.job_id)
                    }

                    if (row.environment_id && row.environment_id != 0) {
                        row.environment_name = formatTableField(environmentMappings[row.environment_id], row.environment_id)
                    }

                    if (row.artifact_id && row.artifact_id != 0) {
                        row.artifact_name = formatTableField(artifactMappings[row.artifact_id], row.artifact_id)
                    }

                    if (row.cluster_id && row.cluster_id != 0) {
                        row.cluster_name = formatTableField(clusterMappings[row.cluster_id], row.cluster_id)
                    }

                    return row
                });
            });
        });
    }
}

export {definitionJobMapService}
