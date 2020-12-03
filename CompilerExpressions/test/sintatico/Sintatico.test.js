require = require('esm')(module);
const tape = require('tape');
const Sintatico = require('../../src/sintatico/Sintatico.mjs').default;

const sintatico = new Sintatico();

tape('Verificar regra sintática do bloco principal sem declarações', (t) => {

    let prods = null;

    t.doesNotThrow(
        () => prods = sintatico.parsearProducoes(`
            inicio
            fim
        `),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<programa> -> <bloco_principal>',
            '<bloco_principal> -> comando-inic comando-fim'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal com declarações', (t) => {

    let prods = null;

    t.doesNotThrow(
        () => prods = sintatico.parsearProducoes(`
            variaveis
                abc : int;
                cba : int;
            inicio
            fim
        `),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<programa> -> <bloco_declaracao> <bloco_principal>',
            '<bloco_principal> -> comando-inic comando-fim',
            '<bloco_declaracao> -> comando-vari <lista_declaracao>',
            '<lista_declaracao> -> <declaracao> <lista_declaracao>',
            '<lista_declaracao> -> <declaracao>',
            '<declaracao> -> identificador especial-dpo <declaracao_tipo> especial-del',
            '<declaracao_tipo> -> nome-escalar-int',
            '<declaracao> -> identificador especial-dpo <declaracao_tipo> especial-del',
            '<declaracao_tipo> -> nome-escalar-int'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal sem declarações e com um comando de atribuição', (t) => {

    let prods = null;

    t.doesNotThrow(
        () => prods = sintatico.parsearProducoes(`
            inicio
                abc = 123;
            fim
        `),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<programa> -> <bloco_principal>',
            '<bloco_principal> -> comando-inic <lista_comando> comando-fim',
            '<lista_comando> -> <comando>',
            '<comando> -> <atribuicao>',
            '<atribuicao> -> identificador especial-atr <retorno_valor> especial-del',
            '<retorno_valor> -> <expressao>',
            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal sem declarações e com dois comandos de atribuição', (t) => {

    let prods = null;

    t.doesNotThrow(
        () => prods = sintatico.parsearProducoes(`
            inicio
                abc = 123;
                cba = abc;
            fim
        `),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<programa> -> <bloco_principal>',
            '<bloco_principal> -> comando-inic <lista_comando> comando-fim',
            '<lista_comando> -> <lista_comando> <comando>',
            '<comando> -> <atribuicao>',
            '<atribuicao> -> identificador especial-atr <retorno_valor> especial-del',
            '<retorno_valor> -> <expressao>',
            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador',
            '<lista_comando> -> <comando>',
            '<comando> -> <atribuicao>',
            '<atribuicao> -> identificador especial-atr <retorno_valor> especial-del',
            '<retorno_valor> -> <expressao>',
            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal com declarações e com comandos de atribuição com expressão aritmetica', (t) => {

    let prods = null;

    t.doesNotThrow(
        () => prods = sintatico.parsearProducoes(`
            variaveis
                resultado: int;
                entrada: int;
            inicio
                entrada = 123;
                resultado = entrada % 2;
            fim
        `),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<programa> -> <bloco_declaracao> <bloco_principal>',
            '<bloco_principal> -> comando-inic <lista_comando> comando-fim',
            '<lista_comando> -> <lista_comando> <comando>',

            '<comando> -> <atribuicao>',
            '<atribuicao> -> identificador especial-atr <retorno_valor> especial-del',
            '<retorno_valor> -> <expressao>',

            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_termo> op-aritmetico-mod <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int',

            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador',

            '<lista_comando> -> <comando>',
            '<comando> -> <atribuicao>',
            '<atribuicao> -> identificador especial-atr <retorno_valor> especial-del',
            '<retorno_valor> -> <expressao>',

            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int',

            '<bloco_declaracao> -> comando-vari <lista_declaracao>',
            '<lista_declaracao> -> <declaracao> <lista_declaracao>',
            '<lista_declaracao> -> <declaracao>',
            '<declaracao> -> identificador especial-dpo <declaracao_tipo> especial-del',
            '<declaracao_tipo> -> nome-escalar-int',
            '<declaracao> -> identificador especial-dpo <declaracao_tipo> especial-del',
            '<declaracao_tipo> -> nome-escalar-int'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal sem declarações e sem o comando fim', (t) => {

    t.throws(
        () => sintatico.parsearProducoes(`
            inicio
                entrada = 123;
        `),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === '$',
        'Não deve reconhecer a entrada'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal sem declarações e sem o comando inicio', (t) => {

    t.throws(
        () => sintatico.parsearProducoes(`
                entrada = 123;
            fim
        `),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado.token.tipo === 'identificador',
        'Não deve reconhecer a entrada'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal com declarações e sem o comando inicio', (t) => {

    t.throws(
        () => sintatico.parsearProducoes(`
            variaveis
                entrada : int;
                entrada = 123;
            fim
        `),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === '$',
        'Não deve reconhecer a entrada'
    );

    t.end();
});

tape('Verificar árvore sintática do bloco principal sem declarações', (t) => {

    const arvore = sintatico.parsear(`
        inicio
        fim
    `);

    const simbolos = [];
    const lexemas = [];
    arvore.preOrdem(n => {
        simbolos.push(n.simbolo);
        if(n.ehFolha) lexemas.push(n.extra.palavra)
    });

    t.deepEqual(
        simbolos,
        ['<programa>', '<bloco_principal>', 'comando-inic', 'comando-fim'],
        'Os símbolos devem estar na ordem esperada quando a árvore é percorrida em pré-ordem'
    );

    t.deepEqual(
        lexemas,
        ['inicio', 'fim'],
        'A árvore deve ter as lexemas esperadas em suas folhas quando percorrida em pré-ordem'
    );

    t.end();
});

tape('Verificar árvore sintática do bloco principal com declarações', (t) => {

    const arvore = sintatico.parsear(`
        variaveis
            abc : int;
            cba : int;
        inicio
        fim
    `);

    const simbolos = [];
    const lexemas = [];
    arvore.preOrdem(n => {
        simbolos.push(n.simbolo);
        if(n.ehFolha) lexemas.push(n.extra.palavra)
    });

    t.deepEqual(
        simbolos,
        [
            '<programa>', '<bloco_declaracao>', 'comando-vari',
            '<lista_declaracao>', '<declaracao>', 'identificador', 'especial-dpo',
            '<declaracao_tipo>', 'nome-escalar-int', 'especial-del',
            '<lista_declaracao>', '<declaracao>', 'identificador', 'especial-dpo',
            '<declaracao_tipo>', 'nome-escalar-int', 'especial-del', '<bloco_principal>',
            'comando-inic', 'comando-fim'
        ],
        'Os símbolos devem estar na ordem esperada quando a árvore é percorrida em pré-ordem'
    );

    t.deepEqual(
        lexemas,
        ['variaveis', 'abc', ':', 'int', ';', 'cba', ':', 'int', ';', 'inicio', 'fim'],
        'A árvore deve ter as lexemas esperadas em suas folhas quando percorrida em pré-ordem'
    );

    t.end();
});

tape('Verificar árvore sintática do bloco principal com declarações e atribuições', (t) => {

    const arvore = sintatico.parsear(`
        variaveis
            resultado: int;
            entrada: int;
        inicio
            entrada = 123;
            resultado = entrada % 2;
        fim
    `);

    const simbolos = [];
    const lexemas = [];
    arvore.preOrdem(n => {
        simbolos.push(n.simbolo);
        if(n.ehFolha) lexemas.push(n.extra.palavra)
    });

    t.deepEqual(
        simbolos,
        [
            '<programa>', '<bloco_declaracao>', 'comando-vari',
            '<lista_declaracao>', '<declaracao>', 'identificador', 'especial-dpo',
            '<declaracao_tipo>', 'nome-escalar-int', 'especial-del',
            '<lista_declaracao>', '<declaracao>', 'identificador', 'especial-dpo',
            '<declaracao_tipo>', 'nome-escalar-int', 'especial-del',
            '<bloco_principal>', 'comando-inic', '<lista_comando>',
            '<lista_comando>', '<comando>', '<atribuicao>', 'identificador',
            'especial-atr', '<retorno_valor>', '<expressao>', '<expressao_termo>',
            '<expressao_fator>', '<literal>', 'literal-int', 'especial-del',
            '<comando>', '<atribuicao>', 'identificador', 'especial-atr',
            '<retorno_valor>', '<expressao>', '<expressao_termo>',
            '<expressao_termo>', '<expressao_fator>', 'identificador',
            'op-aritmetico-mod', '<expressao_fator>', '<literal>', 'literal-int',
            'especial-del', 'comando-fim'
        ],
        'Os símbolos devem estar na ordem esperada quando a árvore é percorrida em pré-ordem'
    );

    t.deepEqual(
        lexemas,
        [
            'variaveis', 'resultado', ':', 'int', ';', 'entrada', ':', 'int', ';',
            'inicio', 'entrada', '=', '123', ';', 'resultado', '=', 'entrada',
            '%', '2', ';', 'fim'
        ],
        'A árvore deve ter as lexemas esperadas em suas folhas quando percorrida em pré-ordem'
    );

    t.end();
});

tape('Busca de nós das expressões aritméticas na árvore sintática', (t) => {

    const arvore = sintatico.parsear(`
        variaveis
            resultado: int;
            entrada: int;
        inicio
            entrada = 123;
            resultado = (entrada + 5) * 2;
        fim
    `);

    t.equals(
        arvore.encontrarTodosNosPreOrdem('<expressao>').length,
        4,
        'Devem existir 4 expressões e subexpressões'
    );

    const atribucoes = arvore.encontrarTodosNosPreOrdem('<atribuicao>');
    const expressoes = [];

    for (const atr of atribucoes) {
        const exps = atr.encontrarTodosNosPreOrdem('<expressao>', 2);
        const s = [];

        for (const e of exps) {
            e.preOrdem(n => { if(n.ehFolha) s.push(n.extra.palavra); });
        }

        expressoes.push(s.join(' '));
    }

    t.equals(
        expressoes.length,
        2,
        'Devem existir 2 expressões imediatas em comandos de atribuição'
    );

    t.deepEqual(
        expressoes,
        ['123', '( entrada + 5 ) * 2'],
        'As expressões em comandos de atribuição devem ser as esperadas'
    );

    t.end();
});
