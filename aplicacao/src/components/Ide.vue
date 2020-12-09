<template>
    <v-card rounded class="h-100" ref="viewport">
        <v-toolbar flat short>
            <v-toolbar-title>CompilerExpressions</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="onCompilar()">
                <v-icon>mdi-hammer-wrench</v-icon>
            </v-btn>
            <v-btn icon @click="onCarregarArquivo()">
                <v-icon>mdi-file</v-icon>
            </v-btn>
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
                            <v-tab
                                href="#tab-simbolico"
                                :disabled="!etapasConcluidas.includes('simbolico')"
                            >
                                Simbólico
                                <v-icon>mdi-chip</v-icon>
                            </v-tab>

                            <v-tab
                                href="#tab-sintese"
                                :disabled="!etapasConcluidas.includes('sintese')"
                            >
                                Síntese
                                <v-icon>mdi-iframe-braces-outline</v-icon>
                            </v-tab>

                            <v-tab
                                href="#tab-semantico"
                                :disabled="!etapasConcluidas.includes('semantico')"
                            >
                                Semântica
                                <v-icon>mdi-function-variant</v-icon>
                            </v-tab>

                            <v-tab
                                href="#tab-sintatico"
                                :disabled="!etapasConcluidas.includes('sintatico')"
                            >
                                Sintática
                                <v-icon>mdi-graph</v-icon>
                            </v-tab>

                        </v-tabs>

                        <v-tabs-items
                            v-model="abaResultado"
                            v-show="etapasConcluidas.length > 0"
                            style="height: 100%; overflow-y: auto; padding-top: 60px;"
                        >
                            <v-tab-item
                                value="tab-sintatico"
                                v-if="etapasConcluidas.includes('sintatico')"
                            >
                                <v-card flat>
                                    <v-card-text>
                                        <ResultadoSintatico :arvore="arvoreSintatica" />
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                            <v-tab-item
                                value="tab-semantico"
                                v-if="etapasConcluidas.includes('semantico')"
                            >
                                <v-card flat>
                                    <v-card-text>
                                        <ResultadoSemantico
                                            :tabela="tabelaDeSimbolos"
                                            :expressoes="arvoresDeExpressoes"/>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                            <v-tab-item
                                value="tab-sintese"
                                v-if="etapasConcluidas.includes('sintese')"
                            >
                                <v-card flat>
                                    <v-card-text>
                                        <ResultadoSintese :gerados="gerados" />
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                            <v-tab-item
                                value="tab-simbolico"
                                v-if="etapasConcluidas.includes('simbolico')"
                            >
                                <v-card flat>
                                    <v-card-text>
                                        <ResultadoSimbolico :simbolico="mips"/>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
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
                            <v-alert
                                color="error"
                                border="left"
                                type="error"
                                v-if="erro !== null"
                            >
                                <h3 class="mb-3">Um erro ocorreu durante a compilação</h3>
                                <ErroDetalhes class="mb-2" :erro="erro" :codigo="codigo" />
                                Realize as correções necessárias e tente novamente
                                clicando no botão
                                <v-icon dense>mdi-hammer-wrench</v-icon>
                                na barra superior.
                            </v-alert>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
        <input
            type="file"
            accept="text/plain"
            ref="inputArquivo"
            style="display: none"
        />
    </v-card>
</template>

<script>

    import { Sintatico, Semantico, Intermediario, Mips } from 'compilerexpressions';
    import ResultadoSintatico from './ide/ResultadoSintatico';
    import ResultadoSemantico from './ide/ResultadoSemantico';
    import ResultadoSintese from './ide/ResultadoSintese';
    import ResultadoSimbolico from './ide/ResultadoSimbolico';
    import Editor from './ide/Editor';
    import ErroDetalhes from './ide/ErroDetalhes';

    export default {
        name: 'Ide',
        components: {
            ResultadoSintatico,
            ResultadoSemantico,
            ResultadoSintese,
            ResultadoSimbolico,
            Editor,
            ErroDetalhes
        },
        data: () => ({
            altura: 0,
            largura: 0,
            abaResultado: '',
            codigo: 'variaveis\n\tvar: int;\ninicio\n\tvar = 0;\n\tretorne var;\nfim',
            etapasConcluidas: [],
            arvoreSintatica: null,
            tabelaDeSimbolos: null,
            arvoresDeExpressoes: null,
            gerados: null,
            mips: null,
            erro: null
        }),
        mounted() {
            window.addEventListener('resize', this.onResize);
            this.onResize();
            this.$refs.inputArquivo.onchange = this.onArquivoCarregado;
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
                this.arvoreSintatica = null;
                this.tabelaDeSimbolos = null;
                this.arvoresDeExpressoes = null;
                this.gerados = [];
                this.mips = null;
                this.erro = null;

                setTimeout(() => { this.compilar(); }, 100);
            },

            onCarregarArquivo() {
                this.$refs.inputArquivo.click();
            },

            onArquivoCarregado(event) {
                const arquivo = event.target.files[0];
                if(typeof(arquivo) !== "object") return;

                const fileReader = new FileReader();
                fileReader.onload = (d) => {
                    this.codigo = d.target.result;
                    this.$refs.inputArquivo.value = '';
                };

                fileReader.readAsText(arquivo);
            },

            compilar() {

                try {
                    const sintatico = new Sintatico();
                    this.arvoreSintatica = sintatico.parsear(this.codigo);
                    this.etapasConcluidas.push('sintatico');

                    const semantico = new Semantico(this.arvoreSintatica);
                    this.arvoresDeExpressoes = semantico.validarComandos();
                    this.tabelaDeSimbolos = semantico.tabelaDeSimbolos;
                    this.etapasConcluidas.push('semantico');

                    const intermediario = new Intermediario(this.arvoresDeExpressoes);
                    const gerados = intermediario.comandos;
                    const optimizados = intermediario.optimizar();
                    this.mips = new Mips(semantico.tabelaDeSimbolos);
                    for (let i = 0; i < intermediario.totalComandos; ++i) {
                        this.gerados.push({
                            gerado: gerados[i],
                            otimizado: optimizados[i],
                            linha: this.arvoresDeExpressoes[i].extra.linha
                        });

                        this.mips.adicionarInstrucoes(optimizados[i]);
                    }

                    this.etapasConcluidas.push('sintese');
                    this.etapasConcluidas.push('simbolico');
                    this.abaResultado = 'tab-simbolico';
                }
                catch(e) {
                    console.error(e);
                    console.log(e.detalhes);
                    this.erro = e;
                    this.etapasConcluidas = [];
                    this.abaResultado = '';
                }
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
