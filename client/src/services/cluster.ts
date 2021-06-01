import {FormFieldType} from "@/components/Form/FormProps";
import {dateTimeFields, idFieldString} from "@/models";
import {BaseService} from "./";

const clusterService = new class extends BaseService {
    baseUrl = "/clusters"
    fieldDeclarations = {
        ...idFieldString,
        name: {
            title: "Name",
            placeholder: "una-nonprod-leldNiNq8C-dev",
            type: FormFieldType.text
        },
        provider_group: {
            title: "Provider Group",
            placeholder: "unanet",
            type: FormFieldType.text
        },
        sch_queue_url: {
            title: "Sch Queue URL",
            placeholder: "https://sqs.us-east-2.amazonaws.com/580107804399/una-nonprod-leldNiNq8C-dev.fifo",
            type: FormFieldType.url
        },
        ...dateTimeFields
    }
}

export {clusterService}
