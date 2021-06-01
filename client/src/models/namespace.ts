import {IDateTimeModel, IIDModel} from "./";

export interface INamespace extends IIDModel, IDateTimeModel {
    name: string
    alias: string
    environment_id: number
    requested_version: string
    explicit_deploy: boolean
    cluster_id: number
}
