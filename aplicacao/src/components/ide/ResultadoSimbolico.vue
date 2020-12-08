<template>
    <div>
        <p class="text-h5 mb-0">Geração de código simbólico</p>
        <span class="text-subtitle1">
            Geração do código simbólico para <strong>arquitetura MIPS</strong>
        </span>
        <div class="mx-n4 mt-3">
            <Editor apenasLeitura modo="gas" :value="assemblyParaString(simbolico)"/>
        </div>
    </div>
</template>

<script>
    import Editor from './Editor';

    export default {
        name: 'ResultadoSimbolico',
        components: { Editor },
        props: {
            simbolico: {
                type: Object,
                required: true
            }
        },
        data: () => ({}),
        methods: {
            assemblyParaString(gerador) {

                const dados = gerador.blocoDados;
                const blocoDados = [];
                let maiorNome = 0;
                for (const d of dados) {
                    blocoDados.push([
                        d.nome,
                        ':',
                        '',
                        '.',
                        d.diretiva,
                        ' ',
                        d.valor
                    ]);

                    if(d.nome.length > maiorNome) maiorNome = d.nome.length;
                }

                const texto = gerador.blocoTexto;

                return [
                    '.data',
                    ...blocoDados.map(d => {
                        d[2] = this.gerarEspacos(maiorNome - d[0].length + 1);
                        return d.join('');
                    }),
                    '',
                    '.text',
                    'main:',
                    ...texto.map(t => {
                        return [
                            this.gerarEspacos(4),
                            t.operador,
                            this.gerarEspacos(8 - t.operador.length),
                            [t.operando, ...t.argumentos].join(', ')
                        ].join('')
                    })
                ].join('\n');
            },
            gerarEspacos(espacos) {
                return Array(espacos).fill(' ').join('');
            }
        }
    }
</script>
