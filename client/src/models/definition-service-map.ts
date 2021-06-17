import {IDateTimeModel, IMappingModel} from "./";

export interface IDefinitionServiceMap extends IDateTimeModel, IMappingModel {
    description: string
    definition_id: number
    service_id: number

    // Metadata
    definition_name: string
    service_name: string
}
