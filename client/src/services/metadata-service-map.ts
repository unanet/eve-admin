import {FormFieldType} from "@/components/Form/FormProps";
import {
    formatTableField,
    generateTableFields,
    mappingModelFields
} from "@/models";
import {
    artifactService,
    BaseService,
    clusterService,
    environmentService,
    metadataService,
    serviceService
} from "./";
import {apiService, APIType, APIResponse} from "@/utils/APIType";
import {IMetadataServiceMap} from "@/models/metadata-service-map";

const metadataServiceMapService = new class extends BaseService {
    baseUrl = "/metadata/service-maps"
    fieldDeclarations = {
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "env:una-dev",
        },
        ...generateTableFields("Metadata", "metadata"),
        ...mappingModelFields,
        ...generateTableFields("Service", "service"),
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

    getLayers(id: number) {
        return apiService.getRequest(APIType.EVE, `/services/${id}/metadata-maps`).then((response: APIResponse) => {
           return response.data
        });
    }

    get() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then((response: APIResponse) => {

            const rows = response.data as IMetadataServiceMap[];
            return Promise.all([
                metadataService.getMappings(),
                serviceService.getMappings(),
                environmentService.getMappings(),
                artifactService.getMappings(),
                clusterService.getMappings()
            ]).then((mappings) => {
                const [metadataService, serviceMappings, environmentMappings, artifactMappings, clusterMappings] = mappings;

                return rows.map(row => {
                    if (row.metadata_id != 0) {
                        row.metadata_name = formatTableField(metadataService[row.metadata_id], row.metadata_id)
                    }

                    if (row.service_id && row.service_id != 0) {
                        row.service_name = formatTableField(serviceMappings[row.service_id], row.service_id)
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

export {metadataServiceMapService}
