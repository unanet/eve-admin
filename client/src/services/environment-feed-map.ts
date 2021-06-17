import {FormFieldType} from "@/components/Form/FormProps";
import {
    artifactService,
    BaseService,
    clusterService,
    definitionService,
    environmentService,
    feedService,
    jobService
} from "./";
import {generateID, getDefaultIDColumnSize} from "@/utils/helpers";
import {APIResponse, apiService, APIType} from "@/utils/APIType";
import {formatTableField, generateTableFields, IDefinitionJobMap, IEnvironmentFeedMap} from "@/models";

const environmentFeedMapService = new class extends BaseService {
    baseUrl = "/environment-feed-maps"
    fieldDeclarations = {
        ...generateTableFields("Environment", "environment"),
        ...generateTableFields("Feed", "feed"),
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

    get() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then((response: APIResponse) => {

            const rows = response.data as IEnvironmentFeedMap[];
            return Promise.all([
                feedService.getMappings(),
                environmentService.getMappings()
            ]).then((mappings) => {
                const [feedMappings, environmentMappings] = mappings;

                return rows.map(row => {
                    if (row.environment_id != 0) {
                        row.environment_name = formatTableField(environmentMappings[row.environment_id], row.environment_id)
                    }

                    if (row.feed_id != 0) {
                        row.feed_name = formatTableField(feedMappings[row.feed_id], row.feed_id)
                    }

                    return row
                });
            });
        });
    }
}

export {environmentFeedMapService}
