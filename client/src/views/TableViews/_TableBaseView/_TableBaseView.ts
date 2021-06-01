import AdminLayout from "@/layouts/AdminLayout/index.vue";
import JsGrid from "@/components/JsGrid/index.vue";
import FormComponent from "@/components/Form/index.vue";
import ModalComponent from "@/components/Modal/index.vue";
import {FormSubmitResponse, IForm} from "@/components/Form/FormProps";
import {APIResponse} from "@/utils/APIType";
import {JSGridProps} from "@/components/JsGrid/JSGridProps";
import {_GrowlMixin} from "@/components/Growl/Growl";

import config from "@/config";

declare const $: any;

const _TableBaseViewMixin = {
    components: {
        AdminLayout,
        FormComponent,
        JsGrid,
        ModalComponent
    },
    mixins: [
        _GrowlMixin
    ],
    mounted() {
        (this as any).refreshGrid();
    },
    methods: {
        refreshGrid: function() {
            const self = this as any;
            self.getData();
            self.formConfig.formFields = self.service.getFormFields();
        },
        getData: function () {
            const self = this as any;

            const service = self.service
            return service.get().then((response: any) => {
                // Catch all to make sure we render the table appropriately, This should probably be fixed on the API side
                if (response == null) {
                    response = [];
                }

                self.tableConfig = {
                    title: self.name,
                    headers: service.getJSTableHeaders(),
                    rows: response,
                    rowClick: self.onRowClick,
                };
                self.dataLoaded = true;
            })
        },
        onRowClick: function (e: any) {
            const self = this as any;
            const item = e.item
            self.selectedItem = item

            self.formConfig = Object.assign(self.formConfig, {
                // Apply decorators
                title: self. getModalName(item),
                isCreate: false,
                formFields: self.service.getFormFields(e.item),
                editItemConfig: self.formConfig.editItemConfig,
            });

            this.openModal();
        },
        _onDelete: function (msg: string, model?: {}) {
            const self = this as any;

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
            const self = this as any;

            return new Promise((resolve, reject) => {
                const method = self.formConfig.isCreate ? "create" : "update"
                self.service[method](item).then((resp: APIResponse) => {
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
            const self = this as any;

            self.selectedItem = null

            self.formConfig = Object.assign(self.formConfig, {
                // Apply decorators
                title: self.getModalName(self.selectedItem),
                isCreate: true,
                createNewItemConfig: self.formConfig.createNewItemConfig
            } as IForm);

            this.openModal();
        },
        openModal: function() {
            $('#modal-xl').modal('show');
        },
        closeModal: function () {
            $('#modal-xl').modal('hide');
        },
        isForcedReadOnly: function(): boolean {
            return config.READ_ONLY;
        }
    },
    data() {
        const self = this as any;

        return {
            service: null,
            selectedItem: null,
            tableConfig: JSGridProps,
            component: FormComponent,
            disableCreate: false,
            extraConfig: {}, // For merging objects into the default form config values
            formConfig: {
                isCreate: false,
                onSubmit: self.onSubmit,
                onDelete: self.onDelete,
                formFields: [], // will be setup in config
                createNewItemConfig: {
                    disabledFields: [],
                    hiddenFields: ["id", "created_at", "updated_at"]
                },
                editItemConfig: {
                    disabledFields: ["id", "created_at", "updated_at"],
                    hiddenFields: []
                }
            } as IForm,
            dataLoaded: false
        }
    }
}

function NewTableBaseView(name: string, service: any, options?: { modelIDField?: string, mixin?: Object}) {

    const idField = options?.modelIDField || "id"

    return {
        Name: name,
        mixins: [
            _TableBaseViewMixin,
            options?.mixin || {},
        ],
        created() {
            (this as any).service = service;
        },
        methods: {
            onSubmit: function (item: any) {
                return (this as any)._onSubmit(item, `${name} created!`);
            },
            onDelete: function () {
                const selectedItem = (this as any).selectedItem
                return (this as any)._onDelete(selectedItem[options?.modelIDField || idField], selectedItem)
            },
            getModalName(item?: any): string {
                return (item) ? `${name} ID: ${item[idField]}` : `New ${name}`;
            }
        },
        data() {
            return {
                idField,
                name,
            }
        }
    }
}

export {_TableBaseViewMixin, NewTableBaseView}
