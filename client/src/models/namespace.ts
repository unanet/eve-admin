import {IDateTimeModel, IIDModel} from "./";

export interface INamespace extends IIDModel, IDateTimeModel {
    name: string
    alias: string
    environment_id: number
    environment_name: string
    requested_version: string
    explicit_deploy: boolean
    cluster_id: number
    cluster_name: string
}
