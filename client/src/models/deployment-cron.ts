import {IIDModel} from "./";

export interface IDeploymentCron extends IIDModel {
    plan_options: Object
    schedule: string
    state: string
    last_run: string
    disabled: boolean
    description: string
    exec_order: number
}
