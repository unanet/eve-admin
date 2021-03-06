// @ts-nocheck
import {defineComponent} from "vue";
import config from "@/config";

import AdminLayout from "@/layouts/AdminLayout/index.vue";
import JsGrid from "@/components/JsGrid/index.vue";
import FormComponent from "@/components/Form/index.vue";
import ModalComponent from "@/components/Modal/index.vue";
import {FormSubmitResponse, IForm} from "@/components/Form/FormProps";
import {APIResponse} from "@/utils/api";
import {_GrowlMixin} from "@/components/Growl/Growl";
import {getObjectValueByKey} from "@/utils/helpers";

declare const $: any;

const _TableBaseViewMixin = defineComponent({
    components: {
        AdminLayout,
        FormComponent,
        JsGrid,
        ModalComponent
    },
    // @ts-ignore
    mixins: [
        _GrowlMixin
    ],
    mounted() {
        // we can check for other id types here
        (this as Record<string, any>).refreshGrid();
    },
    methods: {
        checkURLForQueryParamAndOpenModalIfSet: function (responseData: any[]) {
            // Make this call non blocking, not the best way to do it, but it works
            setTimeout(() => {
                const queryParamIDField = "id";
                // @ts-ignore
                const queryParams = this.$route.query;
                if (queryParamIDField in queryParams) {
                    const idToOpen = getObjectValueByKey(queryParams, queryParamIDField)
                    for (const item of responseData) {
                        // @ts-ignore
                        if (item[this.idField] == Number(idToOpen) || item[this.idField] == idToOpen) {
                            // simulate a row click on the item
                            this.onRowClick({
                                item,
                            })

                            break;
                        }
                    }
                }
            }, 0)
        },
        refreshGrid: function () {
            const self = this as Record<string, any>;
            self.getData();
            self.formConfig.formFields = self.service.getFormFields();
        },
        // @ts-ignore
        getData: function () {
            const self = this as Record<string, any>;

            const service = self.service
            // @ts-ignore
            return service[this.getDataFunction]().then((response: any) => {
                // Catch all to make sure we render the table appropriately, This should probably be fixed on the API side
                if (response == null) {
                    response = [];
                }

                self.tableConfig = Object.assign({
                    fields: service.getJSTableHeaders(),
                    data: response,
                    rowClick: self.onRowClick,
                    tableController: service.tableController
                }, self.tableConfig);

                self.dataLoaded = true;

                self.checkURLForQueryParamAndOpenModalIfSet(response)
            }, (err: any) => {
                console.log("get data errored out", err)
            })
        },
        onRowClick: function (e: any) {
            const self = this as Record<string, any>;
            const item = e.item

            self.selectedItem = item

            self.formConfig = Object.assign(self.formConfig, {
                // Apply decorators
                title: self.getModalName(item),
                isCreate: false,
                formFields: self.service.getFormFields(e.item),
                editItemConfig: self.formConfig.editItemConfig,
            });

            // @ts-ignore
            this.$router.push({query: {id: item[this.idField]}})

            this.openModal();
        },
        _onDelete: function (msg: string, model?: {}) {
            const self = this as Record<string, any>;

            return self.service.delete(self.selectedItem, model).then((resp: APIResponse) => {
                console.log(resp, msg)
                self.showSuccessAlert(`Successfully deleted ${self.name}`);
                this.closeModal();

                // Hacky way to remove the current item from the row. This should be cleaned up :(
                $("#jsGrid").jsGrid("deleteItem", self.selectedItem);
            }).catch((err: any) => {
                console.error(err);
                self.showErrorAlert(`Error deleting ${self.name}`)
            })
        },
        _onSubmit: function (item: any, msg: string) {
            return new Promise((resolve, reject) => {
                // @ts-ignore
                const method = this.formConfig.isCreate ? "create" : "update"

                // @ts-ignore ignore potential null
                this.service[method](item).then((resp: APIResponse) => {
                    resolve({
                        success: true,
                        message: msg,
                    } as FormSubmitResponse)

                    if (method == "create") {
                        // Hacky way to do this, sorry!
                        // Insert our new item in the grid if we are calling create
                        // if (self.selectedItem[self.idField] != (resp.data as any)[self.idField]) {
                        $("#jsGrid").jsGrid("insertItem", resp);
                        // }
                    }

                    this.closeModal()
                }).catch((err: APIResponse) => {
                    reject({
                        success: false,
                        message: err.error,
                    } as FormSubmitResponse)
                })
            });
        },
        clickedAddNew: function () {
            // @ts-ignore
            this.selectedItem = null

            // @ts-ignore Object
            this.formConfig = Object.assign(this.formConfig, {
                // Apply decorators
                // @ts-ignore
                title: this.getModalName(this.selectedItem),
                isCreate: true,
                // @ts-ignore
                createNewItemConfig: this.formConfig.createNewItemConfig
            } as IForm);

            this.openModal();
        },
        getModalName: function (_: any) {
            // noop
            return
        },
        openModal: function () {
            // @ts-ignore
            this.enableModal = true;
            $('#modal-xl').modal('show');
        },
        closeModal: function () {
            // @ts-ignore
            this.enableModal = false;
            $('#modal-xl').modal('hide');

            // Clear ID out of url
            // @ts-ignore
            this.$router.push({query: {id: null}})
        },
        isForcedReadOnly: function (): boolean {
            return config.READ_ONLY;
        }
    },
    data() {
        return {
            getDataFunction: "get",
            service: null,
            selectedItem: null,
            tableConfig: {},
            component: FormComponent,
            enableModal: false,
            disableCreate: false,
            extraConfig: {}, // For merging objects into the default form config values
            formConfig: {
                isCreate: false,
                onSubmit: this.onSubmit,
                onDelete: this.onDelete,
                formFields: [], // will be setup in config
                createNewItemConfig: {
                    disabledFields: [],
                    hiddenFields: ["id", "created_at", "updated_at"]
                },
                editItemConfig: {
                    disabledFields: ["id", "created_at", "updated_at"],
                    hiddenFields: []
                }
            },
            dataLoaded: false,
            // Layering data
            showMetadataLayerLink: false,
            showDefinitionLayerLink: false,
            layeringModelType: null,
        }
    }
})

function NewTableBaseView(name: string, service: any, options?: {modelIDField?: string, mixin?: Record<string, any>}) {

    const idField = options?.modelIDField || "id"

    return {
        Name: name,
        mixins: [
            _TableBaseViewMixin,
            options?.mixin || {},
        ],
        created() {
            (this as Record<string, any>).service = service;
        },
        methods: {
            onSubmit: function (item: any) {
                return (this as Record<string, any>)._onSubmit(item, `${name} created!`);
            },
            onDelete: function () {
                const selectedItem = (this as Record<string, any>).selectedItem
                return (this as any)._onDelete(selectedItem[options?.modelIDField || idField], selectedItem)
            },
            getModalName(item?: any): string {
                return (item) ? `${name} ID: ${item[idField]}` : `New ${name}`;
            }
        },
        data() {
            return {
                idField
            }
        }
    }
}

export {_TableBaseViewMixin, NewTableBaseView}
