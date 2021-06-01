import {IDateTimeModel, IMappingModel} from "./";

export interface IMetadataJobMap extends IMappingModel, IDateTimeModel {
    description: string
    metadata_id: number
    job_id: number
}
