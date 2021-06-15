import {IDateTimeModel, IIDModel} from "./";

export interface IService extends IIDModel, IDateTimeModel {
    name: string
    namespace_id: number
    namespace_name: string
    artifact_id: number
    artifact_name: string
    override_version: string | null
    deployed_version: string | null
    count: number
    explicit_deploy: boolean
    success_exit_codes: string
}
