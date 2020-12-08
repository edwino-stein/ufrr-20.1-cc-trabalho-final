<template>
    <div>
        <p class="text-h5 mb-0">Resultado da análise sintática</p>
        <div class="text-subtitle1 mb-3">
            Representação da <strong>árvore sintática completa</strong> do programa
        </div>
        <ArvoreSintatica :arvore="arvore" exibirExra />
    </div>
</template>

<script>
    import ArvoreSintatica from './ArvoreSintatica'

    export default {
        name: 'ResultadoSintatico',
        components: { ArvoreSintatica },
        props: {
            arvore: {
                type: Object,
                required: true
            }
        },
        data: () => ({})
    }
</script>
