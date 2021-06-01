import {IDateTimeModel, IMappingModel} from "./";

export interface IMetadataServiceMaps extends IMappingModel, IDateTimeModel {
    description: string
    metadata_id: number
    service_id: number
}
