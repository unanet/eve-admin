// @ts-nocheck
import {defineComponent} from "vue";
import {FormFieldType, FormSubmitResponse, IForm, IFormField} from "@/components/Form/FormProps";
import {_GrowlMixin} from "@/components/Growl/Growl";
import {formatDateTimeForUI} from "@/utils/helpers";
import JsonEditor from "@/components/JsonEditor/index.vue";

import config from "@/config";

// @ts-ignore Ignore JQuery not being defined
import SubmitEvent = JQuery.SubmitEvent;

declare const $: any;

const merge = require('lodash.merge');

export default defineComponent({
    name: "Form",
    mixins: [
        _GrowlMixin
    ],
    components: {
        JsonEditor
    },
    props: {
        config: Object as () => IForm,
        extraConfig: Object as () => {},
    },
    mounted() {
        if (this.extraConfig) {
            this._config = merge(this.config, this.extraConfig);
        } else {
            this._config = this.config as Record<string, any>
        }
    },
    data() {
        return {
            _config: {}
        }
    },
    methods: {
        onSubmit(e: SubmitEvent) {
            const self = this as Record<string, any>

            const obj = {};
            e.currentTarget.elements.forEach((el: any) => {
                const isNullable = $(el).attr("nullable");
                if (el.type !== "submit") {
                    // We assume any text area is json
                    if (el.type == "textarea") {
                        // @ts-ignore
                        obj[el.id] = JSON.parse(el.value)
                    } else {
                        switch (el.type) {
                            case FormFieldType.number:
                                // Checks if we allow nulls on the field and if the field is empty, set to null
                                // @ts-ignore
                                obj[el.id] = (isNullable && el.value == "") ? null : +el.value
                                break
                            case FormFieldType.datetime:
                                // We assume anytime a date is used it's a read only field and we
                                //   are not wanting to change it
                                // @ts-ignore
                                delete obj[el.id]  // $(el).attr("original-value")
                                break
                            case FormFieldType.checkbox:
                                // @ts-ignore
                                obj[el.id] = (el.value == "true")
                                break
                            default:
                                // @ts-ignore
                                obj[el.id] = el.value
                                break
                        }
                    }
                }
            });

            // Call our parent's onSubmit callback and then wait for a response.
            // We can trigger a growl alert or something here for user feedback
            self.config.onSubmit(obj).then((submitResponse: FormSubmitResponse) => {
                this.showSuccessAlert(submitResponse.message)
            }).catch((err: FormSubmitResponse) => {
                this.showErrorAlert(err.message)
            })
        },
        getFieldConfig(): Record<any, any> {
            const defaultOmissionsArray = ["created_at"];

            // @ts-ignore
            const cfg = (this._config as Record<string, any>)
            return (cfg?.isCreate) ?
                cfg?.createNewItemConfig || defaultOmissionsArray :
                cfg?.editItemConfig || defaultOmissionsArray;
        },
        isReadOnlyMode(): boolean {
            return config.isReadOnly()
        },
        shouldDisable(key: string): boolean {
            if (config.isReadOnly()) {
                return true
            }

            // This function calls getFieldConfig() for every field, this can probably be optimized
            return this.getFieldConfig()["disabledFields"]?.indexOf(key) > -1
        },
        shouldShowField(key: string): boolean {
            // This function calls getFieldConfig() for every field, this can probably be optimized
            return this.getFieldConfig()["hiddenFields"]?.indexOf(key) < 0
        },
        getValue(i: IFormField) {
            let value = i.value;

            if (i.type === FormFieldType.datetime) {
                value = formatDateTimeForUI(i.value?.Time || i.placeholder)
            }

            // $("input[data-bootstrap-switch]").each(function(){
            //     // @ts-ignore
            //     $(this).bootstrapSwitch('state', $(this).prop((i.value) ? 'checked' : "unchecked"));
            // })

            return value;
        }
    }
});
