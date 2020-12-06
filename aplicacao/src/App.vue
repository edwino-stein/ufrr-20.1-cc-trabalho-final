<template>
    <v-app>
        <v-main>
            <HelloWorld />
        </v-main>
    </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
    name: 'App',

    components: {
        HelloWorld
    },

    data: () => ({}),
};
</script>

<style lang="sass">
    @import '../node_modules/typeface-roboto/index.css'
</style>
