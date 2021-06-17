import {defineComponent} from "vue";
import {IFormField} from "@/components/Form/FormProps";

export default defineComponent({
    name: "JsonEditor",
    props: {
        config: Object as () => IFormField,
        value: Object as () => {}
    },
    watch: {
        config: function(newVal: IFormField) {
            if (newVal != null) {
                (this as Record<string, any>).initializeForm(newVal);
            }
        },
        value: function(newVal: {}) {
            if (newVal != null) {
                (this as Record<string, any>).initializeForm(newVal);
            }
        }
    },
    mounted() {
        (this as Record<string, any>).initializeForm(this.config || this.value);
    },
    methods: {
        initializeForm(data: IFormField|{}) {
            (this as Record<string, any>).jsonDisplayValue = this.syntaxHighlight(("value" in data) ? data.value : data)
        },
        syntaxHighlight(data: any) {
            // Method copied from here https://gist.github.com/tylerbuchea/5483512#file-json-highlight-js
            const fieldPrefix = "json-form-field";
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
      }
    },
});
