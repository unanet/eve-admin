import {FormFieldType} from "@/components/Form/FormProps";
import {
    dateTimeFields,
    formatTableField,
    generateTableFields,
    IMetadataJobMap,
    mappingModelFields
} from "@/models";
import {
    artifactService,
    BaseService,
    clusterService,
    definitionService,
    environmentService,
    jobService,
    metadataService
} from "./";
import {APIResponse, apiService, APIType} from "@/utils/APIType";

const metadataJobMapService = new class extends BaseService {
    baseUrl = "/metadata/job-maps"
    fieldDeclarations = {
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "cluster:devops-prod",
        },
        ...generateTableFields("Metadata", "metadata"),
        ...mappingModelFields,
        ...generateTableFields("Job", "job"),
       ...dateTimeFields
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, this.baseUrl, data).then((response: APIResponse) => response.data);
    }

    create(data: any) {
        return apiService.postRequest(APIType.EVE, this.baseUrl, data).then((response: APIResponse) => response.data);
    }

    delete(data: any) {
        return apiService.deleteRequest(APIType.EVE, this.baseUrl, data).then((response: APIResponse) => response.data);
    }

    getTableData() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then((response: APIResponse) => {

            const rows = response.data as IMetadataJobMap[];
            return Promise.all([
                metadataService.getMappings(),
                jobService.getMappings(),
                environmentService.getMappings(),
                artifactService.getMappings(),
                clusterService.getMappings()
            ]).then((mappings) => {
                const [metadataService, jobMappings, environmentMappings, artifactMappings, clusterMappings] = mappings;

                return rows.map(row => {
                    if (row.metadata_id != 0) {
                        row.metadata_name = formatTableField(metadataService[row.metadata_id], row.metadata_id)
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

export {metadataJobMapService}
