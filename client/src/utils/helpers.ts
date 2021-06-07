import {FormFieldType} from "@/components/Form/FormProps";
import moment from 'moment';

function generateID(min = 1, max = 500): number {
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

function getJSTableHeaders(fieldDeclarations: Record<string, any>) {

    return Object.keys(fieldDeclarations).map(key => {

        const field = getObjectValueByKey(fieldDeclarations, key)

        return Object.assign({
            name: key,
            align: "left",
        }, field, {
            type: field.type || FormFieldType.text,
        })
    })
}

function getFormFields(fieldDeclarations: Record<string, any>, obj?: any) {

    return Object.keys(fieldDeclarations).map(key => {

        const field = getObjectValueByKey(fieldDeclarations, key)

        const returnValue = Object.assign({
            id: key,
            value: null,
        }, field)

        if (obj) {
            returnValue.value = getObjectValueByKey(obj, key);
        }

        return returnValue
    })
}

function findIn(term: string, phrase: string) {
    return phrase.toLowerCase().indexOf(term.toLowerCase()) != -1;
}

function rowFilterStringMatch(row: Record<string, any>, filter: Record<string, any>, key: string): boolean {
    let matching = false;
    if (filter[key] != "") {
        matching = findIn(filter[key], row[key])
    }

    return matching;
}

function shouldShowRowStringsMatch(row: Record<string, any>, filter: Record<string, any>, keys: string[]): boolean {
    let matching = false;

    for (const key of keys) {
        if (rowFilterStringMatch(row, filter, key)) {
            matching = true;
            break;
        }
    }

    return matching
}

function rowFilterNumberMatch(row: Record<string, any>, filter: Record<string, any>, key: string): boolean {
    let matching = false;
    if (filter[key]) {
        matching = findIn(filter[key].toString(), row[key].toString())
    }

    return matching;

}

function shouldShowRowNumbersMatch(row: Record<string, any>, filter: Record<string, any>, keys: string[]): boolean {
    let matching = false;

    for (const key of keys) {
        if (rowFilterNumberMatch(row, filter, key)) {
            matching = true
            break;
        }
    }

    return matching
}

function formatDateTimeForUI(value: string) {
    // Since a dependency includes moment, this won't hurt to include / increase project side. Otherwise we can do the vanilla js approach,
    // but it will break if value is an invalid date, just FYI if we go that approach again
    return moment(value).format("YYYY-MM-DDTHH:mm")
}

export {
    getDefaultIDColumnSize,
    formatDateTimeForUI,
    getObjectValueByKey,
    getJSTableHeaders,
    generateID,
    getFormFields,
    rowFilterStringMatch,
    shouldShowRowStringsMatch,
    rowFilterNumberMatch,
    shouldShowRowNumbersMatch,
    findIn
}
