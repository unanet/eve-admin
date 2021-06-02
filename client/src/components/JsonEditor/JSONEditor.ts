import {defineComponent} from "vue";
import {IFormField} from "@/components/Form/FormProps";

declare const $: any;

export default defineComponent({
    name: "JsonEditor",
    props: {
        config: Object as () => IFormField,
    },
    methods: {
        mounted() {
            (this as any).isMounted = true
            console.log("json editor mounted")
        },
        initializeForm(formField: IFormField) {
            (this as any).jsonDisplayValue = this.syntaxHighlight(formField.value)
        },
        syntaxHighlight(data: any) {
            // Method copied from here https://gist.github.com/tylerbuchea/5483512#file-json-highlight-js
            const fieldPrefix = "json-form-field"
            if (typeof data != 'string') {
                data = JSON.stringify(data, undefined, 2);
            }
            return data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match: any) {
                let cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = `${fieldPrefix}-key`;
                    } else {
                        cls = `${fieldPrefix}-string`;
                    }
                } else if (/true|false/.test(match)) {
                    cls = `${fieldPrefix}-boolean`;
                } else if (/null/.test(match)) {
                    cls = `${fieldPrefix}-null`;
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }
    },
    data() {
      return {
          jsonDisplayValue: {},
          isMounted: false
      }
    },
    watch: {
        config: function(newVal: IFormField) {
            if (newVal != null) {
                (this as any).initializeForm(newVal);
            }
        }
    }
});
