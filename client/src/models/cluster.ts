import {IDateTimeModel, IIDModel} from "./";

export interface ICluster extends IIDModel, IDateTimeModel {
    name: string
    provider_group: string
    sch_queue_url: string
}
