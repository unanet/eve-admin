import {FormFieldType} from "@/components/Form/FormProps";
import {dateTimeFields, idField} from "@/models";
import {BaseService} from "./";

const environmentService = new class extends BaseService {
    baseUrl = "/environments"
    fieldDeclarations = {
        ...idField,
        name: {
            title: "Name",
            type: FormFieldType.text,
            placeholder: "ops-dev",
            width: 25
        },
        alias: {
          title: "Alias",
          type: FormFieldType.text,
          placeholder: "dev",
        },
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "Eve Development Environment"
        },
        updated_at: dateTimeFields.updated_at,
    }
}

export {environmentService}
