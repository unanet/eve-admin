export default (jsGrid: any) => {
    const JSONField = function(config: any) {
        // @ts-ignore suppress the this property
        jsGrid.Field.call(this, config);
    };

    JSONField.prototype = new jsGrid.Field({
        css: "json-field",

        itemTemplate: function(value: any) {
            // return $(`<textarea id="codeMirrorDemo" class="p-3">${value}</textarea>`)
            return "Click for JSON view";
        },
        editTemplate: function(value: any) {
            return `<textarea>${JSON.stringify(value)}</textarea>`;
        }
    });

    return JSONField
}
