import {FormFieldType} from "@/components/Form/FormProps";
import {idField} from "@/models/base";
import {BaseService} from "./";
import {apiService} from "@/utils/APIType";

const deploymentCronService = new class extends BaseService {
    baseUrl = "/deployment-crons"
    fieldDeclarations = {
        ...idField,
        id: {
            title: "ID",
            type: FormFieldType.text,
            placeholder: "60c283d3-1471-4326-b653-a5163ed57237"
        },
        plan_options: {
            title: "Plan Options",
            type: FormFieldType.json,
            placeholder: {"type": "application", "user": "cron", "environment": "una-nonprod", "callback_url": "http://eve-bot-v1:3000/eve-cron-callback?channel=ABC123"},
        },
        schedule: {
            title: "Schedule",
            type: FormFieldType.text,
            placeholder: "*/10 * * * *"
        },
        state: {
            title: "State",
            type: FormFieldType.text,
            placeholder: "idle"
        },
        last_run: {
            title: "Last Run",
            type: FormFieldType.datetime,
            placeholder: "2020-09-24 17:40:33.565983"
        },
        disabled: {
            title: "Disabled",
            type: FormFieldType.checkbox,
            placeholder: false
        },
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "deploy foo service nightly"
        },
        exec_order: {
            title: "Exec Order",
            type: FormFieldType.number,
            placeholder: 0,
        }
    }
}

export {deploymentCronService}
