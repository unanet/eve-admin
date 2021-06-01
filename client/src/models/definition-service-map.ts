import {IDateTimeModel, IMappingModel} from "./";

export interface IDefinitionServiceMap extends IDateTimeModel, IMappingModel {
    description: string
    definition_id: number
    service_id: number
}
