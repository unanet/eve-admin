import {IDateTimeModel, IMappingModel} from "./";

export interface IDefinitionJobMap extends IDateTimeModel, IMappingModel {
    description: string
    definition_id: number
    job_id: number
}
