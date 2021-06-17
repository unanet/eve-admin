import {IDateTimeModel, IMappingModel} from "./";

export interface IMetadataJobMap extends IMappingModel, IDateTimeModel {
    description: string
    metadata_id: number
    job_id: number

    // Metadata
    metadata_name: string
    job_name: string
}
