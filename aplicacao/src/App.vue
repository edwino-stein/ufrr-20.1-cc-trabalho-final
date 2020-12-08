<template>
    <v-app class="primary">
        <v-container :style="{height: (altura) + 'px'}">
            <v-main>
                <Ide />
            </v-main>
        </v-container>
        <v-footer padless absolute class="pb-2" color="primary white--text text-center">
            <p style="width: 100%" class="mb-0">
                <strong>Edwino A. L. Stein</strong> — 2020.1
            </p>
        </v-footer>
    </v-app>
</template>

<script>
import Ide from './components/Ide';

export default {
    name: 'App',

    components: {
        Ide
    },

    data: () => ({
        altura: window.innerHeight,
    }),
    methods : {
        onResize() { this.altura = window.innerHeight; }
    },

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
};
</script>

<style>

    .v-application {
        background: #52beb3 !important;
    }

    .v-application--wrap > .container {
        max-width: 1264px;
        padding-bottom: 40px;
    }

    .v-application--wrap > .container > .v-main {
        height: 100%;
    }

</style>

<style lang="sass">
    @import '../node_modules/typeface-roboto/index.css'
</style>
