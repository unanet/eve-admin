import {idField, dateTimeFields, IService, ICluster, INamespace, IJob} from "@/models";
import {generateID, getDefaultIDColumnSize} from "@/utils/helpers";
import {FormFieldType} from "@/components/Form/FormProps";
import {BaseService} from "./base";
import {artifactFields, formatTableField, namespaceFields} from "@/models/base";
import {APIResponse, apiService, APIType} from "@/utils/APIType";
import {clusterService} from "@/services/cluster";

const jobService = new class extends BaseService {
    baseUrl = "/jobs"
    fieldDeclarations = {
        ...idField,
        name: {
            title: "Name",
            type: FormFieldType.text,
            placeholder: "foo-job",
        },
        ...namespaceFields,
        ...artifactFields,
        override_version: {
            title: "Override Version",
            type: FormFieldType.text,
            placeholder: "20.3.0.13",
        },
        deployed_version: {
            title: "Deployed Version",
            type: FormFieldType.text,
            placeholder: "0.1.0.1",
        },
        success_exit_codes: {
            title: "Success Exit Codes",
            type: FormFieldType.text,
            placeholder: "0",
            width: 100,
            hideInTable: true,
            filtering: false
        },
        explicit_deploy: {
            title: "Explicit Deploy",
            type: FormFieldType.checkbox,
            placeholder: false,
            width: 75,
            filtering: false,
            hideInTable: true
        },
        ...dateTimeFields
    }
    get() {
        return apiService.getRequest(APIType.EVE, this.baseUrl).then((response: APIResponse) => {
           return (response.data as IJob[]).map((job: IJob) => {

               job.artifact_name = formatTableField(job.artifact_name, job.artifact_id)
               job.namespace_name = formatTableField(job.namespace_name, job.namespace_id)

               return job
           })
        });
    }

}

export {jobService}
