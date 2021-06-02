import {FormFieldType} from "@/components/Form/FormProps";

function generateID(min: number = 1, max: number = 500): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDefaultIDColumnSize(): number {
    return 50;
}

function getObjectValueByKey(obj: Record<string, any>, key: string): any {
    return obj[key]
}

function getJSTableHeaders(fieldDeclarations: Object) {

    return Object.keys(fieldDeclarations).map(key => {

        const field = getObjectValueByKey(fieldDeclarations, key)

        return {
            name: key,
            title: field.title,
            type: field.type || FormFieldType.text,
            align: "left",
            width: field.width
        }
    })
}

function getFormFields(fieldDeclarations: Object, obj?: any) {

    return Object.keys(fieldDeclarations).map(key => {

        const field = getObjectValueByKey(fieldDeclarations, key)

        let returnValue = {
            id: key,
            label: field.title,
            type: field.type,
            placeholder: field.placeholder,
            value: null,
            nullable: field.nullable
        }

        if (obj) {
            returnValue.value = getObjectValueByKey(obj, key);
        }

        return returnValue
    })
}

function formatDateTimeForUI(value: string) {

    // @ts-ignore ignore ts not seeing Date as a function
    const date = new Date(value);

    const firstChunk = date.toISOString().split("T")[0]
    // @ts-ignore ignore slice call not being defined
    const secondChunk = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)

    return `${firstChunk}T${secondChunk}`

}

export {getDefaultIDColumnSize, formatDateTimeForUI, getObjectValueByKey, getJSTableHeaders, generateID, getFormFields}
