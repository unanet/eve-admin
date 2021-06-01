import {IDateTimeModel, IIDModel} from "./";

export interface IDefinition extends IIDModel, IDateTimeModel {
    description: string
    definition_type_id: number
    data: any
}
