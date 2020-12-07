<template>
    <v-app class="primary">
        <v-container class="pa-0" >
            <v-row no-gutters >
                <v-col cols="3" class="pa-3">
                    <v-card flat out color="primary">
                        <v-toolbar flat dark dense short color="primary">
                            <v-toolbar-title>
                                <strong>CompilerExpressions</strong>
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn
                                icon
                                small
                                light
                                color="primary"
                                class="white"
                                elevation="1"
                            > <v-icon>mdi-plus</v-icon> </v-btn>
                        </v-toolbar>
                        <ListaDeArquivos />
                    </v-card>
                    <v-footer padless color="primary white--text text-center">
                        <p style="width: 100%" class="mb-0">
                            <strong>Edwino A. L. Stein</strong> — 2020.1
                        </p>
                    </v-footer>
                </v-col>
                <v-col cols="9">
                    <v-container class="ml-0 pl-0">
                        <v-main>
                            <Ide />
                        </v-main>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import ListaDeArquivos from './components/ListaDeArquivos';
import Ide from './components/Ide';

export default {
    name: 'App',

    components: {
        ListaDeArquivos,
        Ide
    },

    data: () => ({}),
};
</script>

<style>

    .v-application {
        background: #52beb3 !important;
    }

    .v-application--wrap > .container {
        max-width: 1585px;
    }

    .v-application--wrap > .container,
    .v-application--wrap > .container > .row,
    .v-application--wrap > .container > .row > .col > .container,
    .v-application--wrap > .container > .row > .col > .container  > .v-main {
        height: 100%;
    }

    .v-application--wrap > .container > .row > .col > .v-card {
        height: calc(100% - 20px);
    }

</style>

<style lang="sass">
    @import '../node_modules/typeface-roboto/index.css'
</style>
