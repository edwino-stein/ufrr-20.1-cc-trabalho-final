<template>
    <v-card rounded class="h-100">
        <v-toolbar flat short>
            <v-toolbar-title>Arquivo</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon color="primary"><v-icon>mdi-hammer-wrench</v-icon></v-btn>
            <v-btn icon color="primary"><v-icon>mdi-delete</v-icon></v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text style="height: calc(100% - 56px);" class="pa-0" ref="viewport">
            <v-row
                no-gutters
                class="h-100"
                :style="{maxHeight: (altura - 1) + 'px'}"
            >
                <v-col class="h-100" :style="{maxWidth: largura + 'px'}">
                    <p>Editor</p>
                </v-col>
                <v-col class="h-100" :style="{maxWidth: largura + 'px'}">
                    <HelloWorld/>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
    import HelloWorld from './HelloWorld';
    export default {
        name: 'Ide',
        components: {
            HelloWorld
        },
        data: () => ({
            altura: 0,
            largura: 0,
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
            onResize() {
                this.altura = this.$refs.viewport.clientHeight;
                this.largura = Math.floor(this.$refs.viewport.clientWidth/2);
            }
        }
    }
</script>

<style>
    .h-100 {
        height: 100%;
    }
</style>
