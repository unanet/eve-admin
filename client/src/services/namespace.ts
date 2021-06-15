import {FormFieldType} from "@/components/Form/FormProps";
import {dateTimeFields, ICluster, idField, INamespace, IService} from "@/models";
import {
    generateID,
    getDefaultIDColumnSize,
} from "@/utils/helpers";
import {BaseService, clusterService} from "./";
import {APIResponse, apiService, APIType} from "@/utils/APIType";
import {formatTableField} from "@/models/base";

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
            placeholder: "current"
        },
        environment_name: {
            title: "Environment",
            type: FormFieldType.text,
            hiddenInForm: true
        },
        environment_id: {
            title: "Environment ID",
            type: FormFieldType.number,
            placeholder: generateID(),
            width: getDefaultIDColumnSize(),
            hideInTable: true,
        },
        requested_version: {
            title: "Requested Version",
            type: FormFieldType.text,
            placeholder: "20.7"
        },
        explicit_deploy: {
            title: "Explicit Version",
            type: FormFieldType.checkbox,
            placeholder: false,
            width: getDefaultIDColumnSize(),
            filtering: false,
            hideInTable: true
        },
        cluster_name: {
            title: "Cluster",
            type: FormFieldType.text,
            hiddenInForm: true
        },
        cluster_id: {
            title: "Cluster ID",
            type: FormFieldType.number,
            placeholder: generateID(),
            hideInTable: true
        },
        ...dateTimeFields,
    }
    get() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then((response: APIResponse) => {
            return clusterService.get().then((clusterData: Record<string, any>) => {

                // Map cluster name to our namespaces
                const clusterMap = Object.fromEntries(clusterData.map((item: ICluster) => [item.id, item.name]));

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
