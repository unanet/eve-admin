// import "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.js"
// declare const CodeMirror: any;
declare const $: any;

const JSONInitFields = ( /*updateCallback: (changes: string) => void */) => {

    // const CodeMirror = require("../third-party/codemirror/codemirror.js")
    // // const _ = require("../third-party/codemirror/javascript.js")
    //
    // const _editor = CodeMirror.fromTextArea(field, {
    //     lineNumbers: true,
    //     value: $field[0].value(),
    //     // mode: 'javascript',
    //     mode: "text/json"
    // });

    // This is tied to only one instance of the json fields. Hope we don't have more than one!
    // _editor.on('changes', () => {
    //     updateCallback(_editor.getValue())
    // });

}

export {JSONInitFields}
