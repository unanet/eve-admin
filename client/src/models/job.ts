import {IDateTimeModel, IIDModel} from "./";

export interface IJob extends IIDModel, IDateTimeModel {
    name: string
    artifact_id: number
    namespace_id: number
    override_version: string | null
    deployed_version: string
    success_exit_codes: number
    explicit_deploy: boolean
}
