import {IDateTimeModel, IMappingModel} from "./";

export interface IMetadataServiceMap extends IMappingModel, IDateTimeModel {
    description: string
    metadata_id: number
    service_id: number

    // Metadata
    metadata_name: string
    service_name: string
}
