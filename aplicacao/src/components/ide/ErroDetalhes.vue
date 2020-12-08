<template>
    <div>
        <p class="mb-1">
            Erro <strong>{{ tipo }}</strong>: {{ menssagem }},
            na linha <strong>{{ linha + 1 }}</strong> e
            coluna <strong>{{ coluna + 1 }}</strong>:
        </p>
        <pre class="erro-detalhes">{{ strLinha }}
{{ rendererMarca() }}</pre>
    </div>
</template>

<script>

    export default {
        name: 'ErroDetalhes',
        components: {},
        props: {
            erro: {
                type: Error,
                required: true
            },
            codigo: {
                type: String,
                required: true
            }
        },
        data: () => ({
            tipo: 'Desconhecido',
            menssagem: 'um erro ocorreu',
            linha: 0,
            coluna: 0,
            colunaMarca: 0,
            strLinha: ''
        }),
        beforeMount() {
            switch (this.erro.message) {
                case 'Erro léxico':
                    this.tipo = 'léxico';
                    this.menssagem = 'Palavra não reconhecida pela linguagem';
                    this.parserDetalhes(this.erro.detalhes.encontrado);
                break;
                case 'Erro sintático':
                    this.tipo = 'sintático';
                    if(this.erro.detalhes.encontrado !== '$'){
                        this.menssagem = 'Token não esperado ou inválido';
                    }
                    else {
                        this.menssagem = 'Fim de cadeia inesperado ou estruta de programa inválida';
                    }
                    this.parserDetalhes(this.erro.detalhes.encontrado);
                break;
                default:
                    this.tipo = 'Desconhecido';
            }
        },
        methods: {
            parserDetalhes(lexema) {
                if(lexema === '$') {
                    const linhas = this.codigo.split(/\r?\n/);
                    this.linha = linhas.length - 1;
                    this.strLinha = linhas[this.linha];
                    this.coluna = this.strLinha.length;
                    this.colunaMarca = this.strLinha.length;
                }
                else {
                    this.linha = lexema.linha;
                    this.coluna = lexema.coluna;

                    const strlinha = this.codigo.split(/\r?\n/)[lexema.linha];
                    this.colunaMarca = [
                        ...strlinha.slice(0, lexema.coluna)
                    ].map(s => s === '\t' ? '    ' : s).join('').length;

                    this.strLinha = strlinha;
                }
            },
            rendererMarca() {
                return [ ...Array(this.colunaMarca).fill('-'), '^' ].join('');
            }
        }
    }
</script>

<style>
    .erro-detalhes {
        background: #00000014;
        border-radius: 3px;
    }
</style>
