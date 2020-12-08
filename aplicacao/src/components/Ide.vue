<template>
    <v-card rounded class="h-100" ref="viewport">
        <v-toolbar flat short>
            <v-toolbar-title>CompilerExpressions</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="onCompilar()">
                <v-icon>mdi-hammer-wrench</v-icon>
            </v-btn>
            <v-btn icon><v-icon>mdi-file</v-icon></v-btn>
        </v-toolbar>
        <v-divider></v-divider>

        <v-card-text class="pa-0">
            <v-row no-gutters >
                <v-col
                    class="ide-editor"
                    :style="{maxWidth: largura + 'px', height: altura + 'px'}"
                >
                    <Editor modo="clike" v-model="codigo" />
                </v-col>
                <v-divider
                  vertical
                ></v-divider>
                <v-col
                    :style="{maxWidth: largura + 'px', height: altura + 'px'}"
                >
                    <v-card
                        class="h-100"
                        flat
                    >
                        <v-tabs
                            color="primary"
                            fixed-tabs
                            icons-and-text
                            height="60"
                            v-model="abaResultado"
                            style="position: absolute; top: 0; z-index:10;"
                        >
                            <v-tabs-slider></v-tabs-slider>
                        </v-tabs>

                        <v-tabs-items
                            v-model="abaResultado"
                            v-show="etapasConcluidas.length > 0"
                            style="height: 100%; overflow-y: auto; padding-top: 60px;"
                        >
                        </v-tabs-items>
                        <div
                            class="pa-3"
                            style="padding-top: 72px !important;"
                            v-show="etapasConcluidas.length === 0"
                        >
                            <v-alert
                                color="primary"
                                border="left"
                                type="info"
                                v-show="erro === null"
                            >
                                <h3 class="mb-3">O código ainda não foi compilado</h3>
                                Utilize o <b>editor de texto ao lado</b> para escrever
                                o código que será a <b>entrada do compilador</b>,
                                e então clique no botão
                                <v-icon dense>mdi-hammer-wrench</v-icon>
                                na barra superior.
                            </v-alert>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>

    import Editor from './ide/Editor';

    export default {
        name: 'Ide',
        components: {
            Editor
        },
        data: () => ({
            altura: 0,
            largura: 0,
            abaResultado: '',
            codigo: 'variaveis\n\tvar: int;\ninicio\n\tvar = 123;\nfim',
            etapasConcluidas: [],
            erro: null
        }),
        mounted() {
            window.addEventListener('resize', this.onResize);
            this.onResize();
        },
        updated() {
            this.onResize();
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize);
        },
        methods: {
            onCompilar() {

                this.abaResultado = '';
                this.etapasConcluidas = [];
                this.erro = null;

                setTimeout(() => { this.compilar(); }, 100);
            },

            compilar() {
            },

            onResize() {
                this.altura = this.$refs.viewport.$el.clientHeight - 57;
                this.largura = Math.floor(
                    (this.$refs.viewport.$el.clientWidth - 1)/2
                );
            }
        }
    }
</script>

<style>
    .h-100 {
        height: 100%;
    }
    .ide-editor .vue-codemirror > .CodeMirror {
        border-radius: 0 0 0 4px;
    }

</style>
