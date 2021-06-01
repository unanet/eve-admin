import {Component} from "vue";

export interface IJSGridOptions {
    height?: string
    width?: string
    sorting?: boolean
    paging?: boolean
    editing?: boolean
    selecting?: boolean
    pageSize?: number
    filtering?: boolean
    pageButtonCount?: number
    clickComponent?: Component
    onEdit?(): void
    rowClick?(): void
}

export class JSGridProps implements IJSGridOptions {
    // Table config
    tableID = "jsGrid"
    height = "auto"
    width = "100%"
    title = "DEFAULT TITLE"
    pageSize = 15
    filtering = false
    pageButtonCount = 5
    paging = true
    sorting = true
    selecting = true
    editing = false

    //  Table Data
    headers = [] as IJSGridHeaderData[]
    rows = []

    clickComponent?: Component

    onEdit?(): void
    onDelete?(): void

    rowClick?(): void

    constructor(obj?: JSGridProps) {
        if (obj != undefined) {
            Object.assign(this, obj)
        }
    }
}

export enum JSGridTableType {
    text = "text",
    number = "number",
    select = "select",
    checkbox = "checkbox"
}

export interface IJSGridHeaderData {
    name: string
    type: JSGridTableType | string
    width?: number
    title?: string
    items?: Record<any, any>[],
    textField?: string
}
