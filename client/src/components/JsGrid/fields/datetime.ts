import {formatDateTimeForUI} from "@/utils/helpers";


export default (jsGrid: any) => {
    const DateTimeField = function(config: any) {
        // @ts-ignore suppress the this property
        jsGrid.Field.call(this, config);
    };

    DateTimeField.prototype = new jsGrid.Field({
        css: "DateTimeField-field",

        itemTemplate: function (value: string) {
            if (!value) {
                return "";
            }
            return `<input class="datetime-grid" type="datetime-local" disabled="true" value="${formatDateTimeForUI(value)}">`
        },
        editTemplate: function(item: any) {
            return `<input type="datetime-local" value="${item.value}">`;
        }
    });

    return DateTimeField
}
