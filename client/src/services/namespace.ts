import {FormFieldType} from "@/components/Form/FormProps";
import {
    dateTimeFields,
    formatTableField,
    generateTableFields,
    ICluster,
    idField, IMetadata,
    INamespace
} from "@/models";
import {getDefaultIDColumnSize,} from "@/utils/helpers";
import {BaseService, clusterService} from "./";
import {APIResponse, apiService, APIType} from "@/utils/APIType";

const namespaceService = new class extends BaseService {
    baseUrl = "/namespaces"
    fieldDeclarations = {
        ...idField,
        name: {
            title: "Name",
            type: FormFieldType.text,
            placeholder: "una-dev-current",
            filtering: false,
            hideInTable: true
        },
        alias: {
            title: "Alias",
            type: FormFieldType.text,
            placeholder: "current",
            width: 25
        },
        ...generateTableFields("Environment", "environment"),
        ...generateTableFields("Cluster", "cluster"),
        requested_version: {
            title: "Requested Version",
            type: FormFieldType.text,
            placeholder: "20.7",
            width: getDefaultIDColumnSize()
        },
        explicit_deploy: {
            title: "Explicit Version",
            type: FormFieldType.checkbox,
            placeholder: false,
            width: getDefaultIDColumnSize(),
            filtering: false,
            hideInTable: true
        },
        ...dateTimeFields,
    }

    getMappings() {
        return this.get().then(models => {
            return Object.fromEntries((models as INamespace[]).map((item: INamespace) => [item.id, item.name]))
        });
    }

    get() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then((response: APIResponse) => {
            return clusterService.getMappings().then((clusterMap: Record<string, any>) => {
                return (response.data as INamespace[]).map((namespace: INamespace) => {
                    namespace.cluster_name = formatTableField(clusterMap[namespace.cluster_id], namespace.cluster_id)
                    namespace.environment_name = formatTableField(namespace.environment_name, namespace.environment_id)
                    return namespace
                });
            })
        });
    }
}

export {namespaceService}
