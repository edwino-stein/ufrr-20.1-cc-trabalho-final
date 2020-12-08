<template>
    <div>
        <p class="text-h5 mb-0">Resultado da análise semântica</p>
        <div class="text-subtitle1 mb-3">
            Lista as <strong>variáveis declaradas</strong> e as
            <strong>árvores sintáticas simplicadas </strong>
            das expressões válidas
        </div>

        <h3 class="mb-1 mt-2">Variáveis declaradas</h3>
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">Nome</th>
                        <th class="text-left">Tipo</th>
                        <th class="text-left">Token</th>
                    </tr>
                </thead>
            <tbody>
                <tr v-for="v in tabela" :key="v.nome">
                    <td><code>{{ v.nome }}</code></td>
                    <td>{{ rendererTipo(v.tipo) }}</td>
                    <td>{{ v.token.tipo }}</td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>

        <h3 class="mb-2 mt-5">Expressões</h3>
        <div
            v-for="e in expressoes"
            :key="'l'+e.extra.linha+'-c'+e.extra.coluna"
            class="mb-5"
        >
            <h4>Linha {{ e.extra.linha + 1 }}</h4>
            <p class="pl-3 mb-0">
                Forma pré-fixa:
                <code> {{ rendererExpressao(e) }}</code>
            </p>
            <p class="pl-3 ">Árvore sintática simplificada:</p>
            <ArvoreSintatica :arvore="e"/>
        </div>
    </div>
</template>

<script>
    import ArvoreSintatica from './ArvoreSintatica'

    export default {
        name: 'ResultadoSemantico',
        components: { ArvoreSintatica },
        props: {
            tabela: {
                type: Array,
                required: true
            },
            expressoes: {
                type: Array,
                required: true
            }
        },
        data: () => ({}),
        methods: {
            rendererTipo (tipo) {
                return { 'int': 'Inteiro' }[tipo];
            },
            rendererExpressao(arvore) {
                const simbolos = [];
                arvore.emOrdem(n => simbolos.push(n.simbolo));
                return simbolos.join(' ');
            }
        }
    }
</script>
