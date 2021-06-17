import {FormFieldType} from "@/components/Form/FormProps";
import {IDefinition, IDefinitionType, idField} from "@/models";
import {BaseService} from "./";

const definitionTypeService = new class extends BaseService {
    baseUrl = "/definition-types"
    fieldDeclarations = {
        ...idField,
        name: {
            title: "Name",
            type: FormFieldType.text,
            placeholder: "Deployment"
        },
        description: {
            title: "Description",
            type: FormFieldType.text,
            placeholder: "Kubernetes v1 Deployment Config"
        },
        class: {
            title: "Class",
            type: FormFieldType.text,
            placeholder: "apps"
        },
        version: {
            title: "Version",
            type: FormFieldType.text,
            placeholder: "v1"
        },
        kind: {
            title: "Kind",
            type: FormFieldType.text,
            placeholder: "Deployment"
        },
        definition_order: {
            title: "Definition Order",
            type: FormFieldType.text,
            placeholder: "main"
        }
    }

    getMappings() {
        return this.get().then(models => {
            return Object.fromEntries((models as IDefinitionType[]).map((item: IDefinitionType) => [item.id, item.name]))
        });
    }

}

export {definitionTypeService}
