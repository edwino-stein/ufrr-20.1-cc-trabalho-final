<template>
    <div>
        <p class="text-h5 mb-0">Geração de código intermediário</p>
        <span class="text-subtitle1">
            Apresenta as etapas da geração de <strong>código intermediário</strong>
        </span>

        <p class="text-h6 mb-2 mt-2">Geração de código intermediário</p>
        <div v-for="(g) in gerados" :key="'linha-'+g.linha">
            <h4 class="mb-2 mt-2">Expressão da linha {{ g.linha + 1 }} </h4>
            <h5 class="mb-1">Código gerado</h5>
            <v-simple-table dense class="mb-1">
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-center">Operador</th>
                            <th class="text-center">Argumento 1</th>
                            <th class="text-center">Argumento 2</th>
                            <th class="text-center">Destino</th>
                        </tr>
                    </thead>
                <tbody>
                    <tr v-for="(i,j) in g.gerado" :key="i.linha+'-gerado-'+j">
                        <td class="text-center">{{ i.operador }}</td>
                        <td class="text-center">{{ i.argumentos[0] }}</td>
                        <td class="text-center">
                            {{ i.argumentos.length > 1 ? i.argumentos[1] : '' }}
                        </td>
                        <td class="text-center">{{ i.operando }}</td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>

            <h5 class="mb-1">Código otimizado</h5>
            <v-simple-table dense>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-center">Operador</th>
                            <th class="text-center">Argumento 1</th>
                            <th class="text-center">Argumento 2</th>
                            <th class="text-center">Destino</th>
                        </tr>
                    </thead>
                <tbody>
                    <tr v-for="(i,j) in g.otimizado" :key="i.linha+'-otimizado-'+j">
                        <td class="text-center">{{ i.operador }}</td>
                        <td class="text-center">{{ i.argumentos[0] }}</td>
                        <td class="text-center">
                            {{ i.argumentos.length > 1 ? i.argumentos[1] : '' }}
                        </td>
                        <td class="text-center">{{ i.operando }}</td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'ResultadoSintese',
        components: { },
        props: {
            gerados: {
                type: Array,
                required: true
            },
        },
        data: () => ({}),
    }
</script>
