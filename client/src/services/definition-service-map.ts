import {FormFieldType} from "@/components/Form/FormProps";
import {
    formatTableField,
    generateTableFields,
    IDefinitionJobMap,
    IDefinitionServiceMap,
    mappingModelFields
} from "@/models";
import {getDefaultIDColumnSize} from "@/utils/helpers";
import {
    artifactService,
    BaseService,
    clusterService,
    definitionService,
    environmentService,
    jobService,
    serviceService
} from "./";
import {APIResponse, apiService, APIType} from "@/utils/api";

const definitionServiceMapService = new class extends BaseService {
    baseUrl = "/definitions/service-maps"
    fieldDeclarations = {
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "resource:base",
        },
        ...generateTableFields("Definition", "definition"),
        ...generateTableFields("Service", "service"),
        ...mappingModelFields
    }

    update(data: any) {
        return apiService.putRequest(APIType.EVE, `/definitions/${data.definition_id}/service-maps`, data).then((response: APIResponse) => {
            return response.data
        });
    }

    delete(data: any) {
        return apiService.deleteRequest(APIType.EVE, `/definitions/${data.definition_id}/service-maps/${data.desc}`, data).then((response: APIResponse) => {
            return response.data
        });
    }

    getTableData() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then((response: APIResponse) => {

            const rows = response.data as IDefinitionServiceMap[];
            return Promise.all([
                definitionService.getMappings(),
                serviceService.getMappings(),
                environmentService.getMappings(),
                artifactService.getMappings(),
                clusterService.getMappings()
            ]).then((mappings) => {
                const [definitionMappings, serviceMappings, environmentMappings, artifactMappings, clusterMappings] = mappings;

                return rows.map(row => {
                    if (row.definition_id != 0) {
                        row.definition_name = formatTableField(definitionMappings[row.definition_id], row.definition_id)
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

export {definitionServiceMapService}
