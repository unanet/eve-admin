import {IIDModel} from "./";

export interface IDefinitionType extends IIDModel {
    name: string
    description: string
    class: string
    version: string
    kind: string
    definition_order: string
}
