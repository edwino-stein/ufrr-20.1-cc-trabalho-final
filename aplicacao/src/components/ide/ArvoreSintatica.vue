<template>
    <div ref="arvoreSintatica" class="text-center mx-n4" style="overflow-x: auto;">
        <div></div>
    </div>
</template>

<script>

    export default {
        name: 'ArvoreSintatica',
        components: {},
        props: {
            arvore: {
                type: Object,
                required: true
            },
            exibirExra: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        data: () => ({}),
        mounted() {

            const renderArvore = (no) => {
                const config = { label: no.simbolo };
                if(no.nos.length === 0 && no.extra !== null && this.exibirExra) {
                    config['children'] = [{ label: no.extra.palavra }];
                }
                else {
                    config['children'] = [];
                    for (const n of no.nos) config['children'].push(renderArvore(n));
                }
                return config;
            }

            const arvoreCfg = renderArvore(this.arvore);
            const $arvore = this.$refs.arvoreSintatica.children[0];
            const render = new window.TreeDrawer($arvore, arvoreCfg);
            render.draw();
        }
    }
</script>
