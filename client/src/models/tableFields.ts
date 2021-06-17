import {FormFieldType} from "@/components/Form/FormProps";
import {generateID, getDefaultIDColumnSize} from "@/utils/helpers";

function formatTableField(name: string, id: number) {
    return `${name} (${id})`;
}

const idFieldString = {
    id: {
        title: "ID",
        type: FormFieldType.text,
        placeholder: generateID(),
        width: getDefaultIDColumnSize()
    },
}

const idField = {
    id: {
        title: "ID",
        type: FormFieldType.number,
        placeholder: generateID(),
        width: getDefaultIDColumnSize()
    },
}

const dateTimeFields = {
    updated_at: {
        title: "Updated at",
        placeholder: "2020-05-28T01:14:16.11056Z",
        type: FormFieldType.datetime,
        width: 75,
        hideInTable: true
    },
    created_at: {
        title: "created at",
        placeholder: "2020-05-28T01:14:16.11056Z",
        type: FormFieldType.datetime,
        width: 75,
        hideInTable: true
    },
}

function generateTableFields(label: string, key: string): Record<string, any> {
    const objToReturn = {} as Record<string, any>;
    objToReturn[`${key}_id`] = {
        title: `${label} ID`,
        type: FormFieldType.number,
        placeholder: null,
        filtering: false,
        hideInTable: true,
    }
    objToReturn[`${key}_name`] = {
        title: label,
        type: FormFieldType.text,
        width: getDefaultIDColumnSize()
    }
    return objToReturn
}

const mappingModelFields = {
    ...generateTableFields("Environment", "environment"),
    ...generateTableFields("Artifact", "artifact"),
    ...generateTableFields("Namespace", "namespace"),
    ...generateTableFields("Cluster", "cluster"),
    stacking_order: {
        title: "Stacking Order",
        type: FormFieldType.number,
        placeholder: 0,
        width: getDefaultIDColumnSize(),
        nullable: true
    },
}

export {
    formatTableField,
    generateTableFields,
    idField,
    idFieldString,
    dateTimeFields,
    mappingModelFields,
}
