declare const $: any;

export default (jsGrid: any) => {
    const LinkField = function(config: any) {
        // @ts-ignore suppress the this property
        jsGrid.Field.call(this, config);
    };

    LinkField.prototype = new jsGrid.Field({
        css: "jsgrid-link-field",

        itemTemplate: function(value: any) {
            return $("<a>").addClass("fas fa-layer-group")
                .attr({
                    href: "#/admin/models/service?id=123",
                })
                .on("click", function (e: any) {
                    e.stopPropagation();
                })
            //     .add($("<input>")
            //         .addClass("jsgrid-button")
            //         .addClass("jsgrid-cancel-edit-button")
            //         .attr({
            //             type: "button",
            //         })
            //         .on("click", function (e: any) {
            //             e.stopPropagation();
            //             console.log("clicked other button")
            //         }));
        },
    });

    return LinkField
}
