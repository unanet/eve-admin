declare const $: any;

export default (jsGrid: any) => {
    const LayeringControlField = function(config: any) {
        // @ts-ignore suppress the this property
        jsGrid.Field.call(this, config);
    };

    LayeringControlField.prototype = new jsGrid.Field({
        itemTemplate: function(value: any, item: any) {
            let $result = $([]);

            if(item.Editable) {
                $result = $result.add(this._createEditButton(item));
            }

            if(item.Deletable) {
                $result = $result.add(this._createDeleteButton(item));
            }

            return $result;
        }
    });

    return LayeringControlField
}
