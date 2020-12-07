<template>
    <v-list dense shaped dark color="primary">
        <v-list-item-group>
            <v-list-item>
                <v-list-item-icon>
                    <v-icon>mdi-file</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Arquivo 1</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-icon>
                    <v-icon>mdi-file</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Arquivo 2</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-icon>
                    <v-icon>mdi-file</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Arquivo 3</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
    </v-list>
</template>

<script>
    export default {
        name: 'ListaDeArquivos',
        data: () => ({}),
    }
</script>
