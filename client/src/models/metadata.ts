import {IDateTimeModel, IIDModel} from "./";

export interface IMetadata extends IIDModel, IDateTimeModel {
    description: string
    value: any
    migrated_from: number
}
