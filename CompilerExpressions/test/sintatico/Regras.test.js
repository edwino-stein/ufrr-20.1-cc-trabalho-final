require = require('esm')(module);
const tape = require('tape');
const gramatica = require('../../src/sintatico/Regras.mjs').default;
const PrecedenciaFraca = require('../../src/sintatico/PrecedenciaFraca.mjs').default;
const LexicoBuffer = require('../../src/lexico/LexicoBuffer.mjs').default;

tape('Verificar regra sintática de declaração de variável', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<declaracao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'identificador especial-dpo nome-escalar-int especial-del',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<declaracao> -> identificador especial-dpo <declaracao_tipo> especial-del',
            '<declaracao_tipo> -> nome-escalar-int'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática do bloco de declaração de variávés', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<bloco_declaracao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'comando-vari',
                    'identificador especial-dpo nome-escalar-int especial-del',
                    'identificador especial-dpo nome-escalar-int especial-del'
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
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

tape('Verificar regra sintática de uma expressão aritmética no padrão "id"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'identificador',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "int"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'literal-int',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int',
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "-int"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'op-aritmetico-sub literal-int',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<expressao> -> op-aritmetico-sub <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "int + id"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'literal-int op-aritmetico-adi identificador',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<expressao> -> <expressao> op-aritmetico-adi <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador',
            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "id * int"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'identificador op-aritmetico-mul literal-int',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_termo> op-aritmetico-mul <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "(id + id) / int"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'especial-apa identificador op-aritmetico-adi identificador',
                    'especial-fpa op-aritmetico-div literal-int',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_termo> op-aritmetico-div <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> especial-apa <expressao> especial-fpa',
            '<expressao> -> <expressao> op-aritmetico-adi <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador',
            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "id - id * int"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'identificador op-aritmetico-sub identificador',
                    'op-aritmetico-mul literal-int',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<expressao> -> <expressao> op-aritmetico-sub <expressao_termo>',
            '<expressao_termo> -> <expressao_termo> op-aritmetico-mul <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador',
            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "(-id) % int"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'especial-apa op-aritmetico-sub identificador especial-fpa',
                    'op-aritmetico-mod literal-int',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_termo> op-aritmetico-mod <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> especial-apa <expressao> especial-fpa',
            '<expressao> -> op-aritmetico-sub <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "-id * int"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'op-aritmetico-sub identificador op-aritmetico-mul literal-int',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<expressao> -> op-aritmetico-sub <expressao_termo>',
            '<expressao_termo> -> <expressao_termo> op-aritmetico-mul <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "-int + id"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'op-aritmetico-sub literal-int op-aritmetico-adi identificador',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<expressao> -> <expressao> op-aritmetico-adi <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador',
            '<expressao> -> op-aritmetico-sub <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int'
        ],
        'As produções devem casar'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "id + *"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'identificador op-aritmetico-adi op-aritmetico-mul',
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === 'op-aritmetico-mul',
        'Não deve reconhecer a entrada "id + *"'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "int %"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'literal-int op-aritmetico-mod',
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === '$',
        'Não deve reconhecer a entrada "int %"'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "+ int"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'op-aritmetico-adi literal-int',
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === 'op-aritmetico-adi',
        'Não deve reconhecer a entrada "+ int"'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "/ int"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'op-aritmetico-div literal-int',
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === 'op-aritmetico-div',
        'Não deve reconhecer a entrada "/ int"'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "( )"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'especial-apa especial-fpa',
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === 'especial-fpa',
        'Não deve reconhecer a entrada "( )"'
    );

    t.end();
});

tape('Verificar regra sintática de uma expressão aritmética no padrão "( id + int ) * ( id"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<expressao>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'especial-apa identificador op-aritmetico-adi literal-int',
                    'especial-fpa op-aritmetico-mul especial-apa identificador',
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === '$',
        'Não deve reconhecer a entrada "( id + int ) * ( id"'
    );

    t.end();
});

tape('Verificar regra sintática de uma atribuicao no padrão "id = int;"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<atribuicao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'identificador especial-atr literal-int especial-del',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
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

tape('Verificar regra sintática de uma atribuicao no padrão "id = id + int;"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<atribuicao>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'identificador especial-atr identificador op-aritmetico-adi',
                    'literal-int especial-del',
                ]
            )
        ),
        'Deve reconhecer a entrada'
    );

    t.deepEqual(
        prods.map(p => p.comoString),
        [
            '<atribuicao> -> identificador especial-atr <retorno_valor> especial-del',
            '<retorno_valor> -> <expressao>',
            '<expressao> -> <expressao> op-aritmetico-adi <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> <literal>',
            '<literal> -> literal-int',
            '<expressao> -> <expressao_termo>',
            '<expressao_termo> -> <expressao_fator>',
            '<expressao_fator> -> identificador'
        ],
        'As produções devem casar'
    );

    t.end();
});


tape('Verificar regra sintática de uma atribuicao no padrão "id = id"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<atribuicao>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'identificador especial-atr identificador',
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === '$',
        'Não deve reconhecer a entrada "id = id"'
    );

    t.end();
});

tape('Verificar regra sintática de uma atribuicao no padrão "int = id;"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<atribuicao>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'literal-int especial-atr identificador especial-del',
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === 'literal-int',
        'Não deve reconhecer a entrada "int = id;"'
    );

    t.end();
});

tape('Verificar regra sintática de uma atribuicao no padrão "+ id = int;"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<atribuicao>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'op-aritmetico-adi identificador especial-atr',
                    'literal-int especial-del',
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === 'op-aritmetico-adi',
        'Não deve reconhecer a entrada "+ id = int;"'
    );

    t.end();
});

tape('Verificar regra sintática de uma atribuicao no padrão "(id = int);"', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<atribuicao>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'especial-apa identificador especial-atr literal-int',
                    'especial-fpa especial-del',
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === 'especial-apa',
        'Não deve reconhecer a entrada "(id = int);"'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal sem declarações', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'comando-inic',
                    'comando-fim'
                ]
            )
        ),
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

    const analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'comando-vari',
                    'identificador especial-dpo nome-escalar-int especial-del',
                    'identificador especial-dpo nome-escalar-int especial-del',
                    'comando-inic',
                    'comando-fim'
                ]
            )
        ),
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

    const analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'comando-inic',
                    'identificador especial-atr literal-int especial-del',
                    'comando-fim'
                ]
            )
        ),
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

    const analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
    let prods = null;

    t.doesNotThrow(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'comando-inic',
                    'identificador especial-atr literal-int especial-del',
                    'identificador especial-atr identificador especial-del',
                    'comando-fim'
                ]
            )
        ),
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

tape('Verificar regra sintática do bloco principal sem declarações e sem o comando fim', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'comando-inic',
                    'identificador especial-atr literal-int especial-del'
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === '$',
        'Não deve reconhecer a entrada'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal sem declarações e sem o comando inicio', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'identificador especial-atr literal-int especial-del',
                    'comando-fim'
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === 'identificador',
        'Não deve reconhecer a entrada'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal com declarações e sem o comando inicio', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'comando-vari',
                    'identificador especial-dpo nome-escalar-int especial-del',
                    'identificador especial-atr literal-int especial-del',
                    'comando-fim'
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === '$',
        'Não deve reconhecer a entrada'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal sem declarações comando inválido', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'comando-inicio',
                    'identificador literal-int especial-del',
                    'comando-fim'
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === 'comando-inicio',
        'Não deve reconhecer a entrada'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal com declarações inválda e comando válido', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'comando-vari',
                    'identificador nome-escalar-int especial-del',
                    'comando-inicio',
                    'identificador especial-atr literal-int especial-del',
                    'comando-fim'
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === 'nome-escalar-int',
        'Não deve reconhecer a entrada'
    );

    t.end();
});

tape('Verificar regra sintática do bloco principal com declarações nválda e comando inválido', (t) => {

    const analisador = new PrecedenciaFraca(gramatica, '<programa>', '$');
    let prods = null;

    t.throws(
        () => prods = analisador.analisar(
            new LexicoBuffer(
                (s, l) => s.split(' '),
                '$',
                [
                    'comando-vari',
                    'identificador especial-dpo nome-escalar-int especial-del',
                    'comando-inicio',
                    'identificador especial-atr literal-int',
                    'comando-fim'
                ]
            )
        ),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado === 'comando-inicio',
        'Não deve reconhecer a entrada'
    );

    t.end();
});
