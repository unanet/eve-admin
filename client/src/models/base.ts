import {FormFieldType} from "@/components/Form/FormProps";
import {generateID, getDefaultIDColumnSize} from "@/utils/helpers";

interface IIDModel {
    id: number
}

interface IDateTimeModel {
    created_at: string
    updated_at: string
}

interface IMappingModel {
    environment_id: number | null
    artifact_id: number | null
    namespace_id: number | null
    cluster_id: number | null
    stacking_order: number | null
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
    },
    created_at: {
        title: "created at",
        placeholder: "2020-05-28T01:14:16.11056Z",
        type: FormFieldType.datetime,
        width: 75,
    },
}

const mappingModelFields = {
    environment_id: {
        title: "Environment ID",
        type: FormFieldType.number,
        placeholder: null,
        width: getDefaultIDColumnSize(),
        nullable: true
    },
    artifact_id: {
        title: "Artifact ID",
        type: FormFieldType.number,
        placeholder: null,
        width: getDefaultIDColumnSize(),
        nullable: true
    },
    namespace_id: {
        title: "Namespace ID",
        type: FormFieldType.number,
        placeholder: null,
        width: getDefaultIDColumnSize(),
        nullable: true
    },
    cluster_id: {
        title: "Cluster ID",
        type: FormFieldType.number,
        placeholder: null,
        width: getDefaultIDColumnSize(),
        nullable: true
    },
    stacking_order: {
        title: "Stacking Order",
        type: FormFieldType.number,
        placeholder: 0,
        width: getDefaultIDColumnSize(),
        nullable: true
    },
}

export {IMappingModel, IIDModel, IDateTimeModel, generateID, mappingModelFields, idField, idFieldString, dateTimeFields}
