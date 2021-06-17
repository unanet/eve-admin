import {generateID} from "@/utils/helpers";

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


    // Metadata
    environment_name: string | null
    artifact_name: string | null
    namespace_name: string | null
    cluster_name: string | null
}

export {
    IMappingModel,
    IIDModel,
    IDateTimeModel,
    generateID
}
