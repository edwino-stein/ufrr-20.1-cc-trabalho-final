<template>
    <div style="height: 100%;">
        <codemirror
            :value="value"
            :options="opcoes"
            @input="$emit('input', $event)"
        ></codemirror>
    </div>
</template>

<script>

    import { codemirror } from 'vue-codemirror'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/mode/clike/clike.js'
    import 'codemirror/mode/gas/gas.js'

    export default {
        name: 'Editor',
        components: {
            codemirror
        },
        props: {
            modo: {
                type: String,
                required: false,
                default: 'clike'
            },
            apenasLeitura: {
                type: Boolean,
                required: false,
                default: false
            },
            value: {
                type: String,
                required: true,
            }
        },
        data: () => ({
            opcoes: {
                tabSize: 4,
                indentUnit: 4,
                mode: 'clike',
                lineNumbers: true,
                smartIndent: false,
                lineWrapping: false,
                readOnly: false,
            }
        }),
        beforeMount() {
            this.opcoes.mode = this.modo;
            this.opcoes.readOnly = this.apenasLeitura;
        }
    }
</script>

<style>

    .vue-codemirror,
    .vue-codemirror > .CodeMirror {
        height: 100%;
    }

</style>
