import {IIDModel} from "./";

export interface IArtifact extends IIDModel {
    name: string
    feed_type: string
    provider_group: string
    image_tag: string
    service_port: number
    metrics_port: number
}
