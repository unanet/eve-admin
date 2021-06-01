// @ts-ignore Ignore JQuery not being defined
import SubmitEvent = JQuery.SubmitEvent;

export enum FormFieldType {
    button = "button",
    checkbox = "checkbox",
    color = "color",
    date = "date",
    datetime = "datetime-local",
    email = "email",
    file = "file",
    hidden = "hidden",
    image = "image",
    month = "month",
    number = "number",
    password = "password",
    radio = "radio",
    range = "range",
    reset = "reset",
    search = "search",
    submit = "submit",
    tel = "tel",
    text = "text",
    time = "time",
    url = "url",
    week = "week",
    // Custom Properties
    json = "json",
}

export interface FormSubmitResponse {
    success: boolean
    message: string
}

export interface IFormField {
    id: string
    label: string
    type: FormFieldType
    placeholder: string
    value: any
    nullable: boolean
}

export interface IForm {
    isCreate: boolean
    onSubmit: (e: SubmitEvent) => FormSubmitResponse
    formFields: Array<IFormField>
    title?: string
    disabledFields? : string[]
    hiddenFields? : string[]
    createNewItemConfig: {}
    editItemConfig: {}
    disableActions?: boolean
}
