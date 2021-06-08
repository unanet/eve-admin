declare const $: any;

export default (jsGrid: any) => {
    const LayeringControlField = function(config: any) {
        // @ts-ignore suppress the this property
        jsGrid.Field.call(this, config);
    };

    LayeringControlField.prototype = new jsGrid.Field({
        type: "control",
        name: "Layering",
        headercss: "layering-control jsgrid-align-left",
        // itemTemplate: function(value: any, item: any) {
        //     let $result = $([]);
        //
        //     if(item.Editable) {
        //         $result = $result.add(this._createEditButton(item));
        //     }
        //
        //     if(item.Deletable) {
        //         $result = $result.add(this._createDeleteButton(item));
        //     }
        //
        //     return $result;
        // }

        itemTemplate: function(value: any, item: any) {
            console.log("itemTemplate", value, item)
            return "<td>" + item + "</td>";
        },
        cellRenderer: function(item: any, value: any) {

            return $("<td>")
                .on("click", function (e: any) {
                    // stop all clicks on our cell
                    e.stopPropagation();
                })
        }
    });

    return LayeringControlField
}
