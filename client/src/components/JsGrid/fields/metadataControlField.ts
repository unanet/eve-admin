import NavItem from "@/components/Nav/NavItem/NavItem";

declare const $: any;

export default (jsGrid: any) => {
    const MetadataControlField = function(config: any) {
        // @ts-ignore suppress the this property
        jsGrid.Field.call(this, config);
    };

    MetadataControlField.prototype = new jsGrid.Field({
        css: "jsgrid-metadata-control-field jsgrid-align-center",

        itemTemplate: function(value: any) {
            return $("<a>").addClass("fas fa-layer-group")
                .attr({
                    href: "#/admin/models/service",
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

    return MetadataControlField
}
