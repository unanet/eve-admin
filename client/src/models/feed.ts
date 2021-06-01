import {IIDModel} from "./";

export interface IFeed extends IIDModel {
    name: string
    promotion_order: number
    feed_type: string
    alias: string
}
