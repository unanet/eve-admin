import {IIDModel} from "./";

export interface IEnvironment extends IIDModel {
    name: string
    alias: string
    description: string
    updated_at: string
}
