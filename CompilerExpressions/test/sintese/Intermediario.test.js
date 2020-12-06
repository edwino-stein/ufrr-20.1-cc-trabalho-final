require = require('esm')(module);
const tape = require('tape');
const Sintatico = require('../../src/sintatico/Sintatico.mjs').default;
const Semantico = require('../../src/semantico/Semantico.mjs').default;
const Intermediario = require('../../src/sintese/Intermediario.mjs').default;

const sintatico = new Sintatico();

tape('Verificar código intermediário de uma atribuição simples', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
        inicio
            a = 123;
        fim
    `));
    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);

    t.equals(
        gerador.totalComandos,
        1,
        'Deve ter apenas um comando'
    );

    const instrucoes = gerador.comandos[0];
    t.equals(
        instrucoes.length,
        2,
        'O comando deve ter 2 instruções'
    );

    t.deepEqual(
        instrucoes.map(i => i.comoString()),
        [
            '= ( 123 ) -> <0>',
            '= ( <0> ) -> a'
        ],
        'As instruções devem ser as esperadas'
    );

    t.end();
});

tape('Verificar código intermediário de uma atribuição simples iniciando com sinal negativo', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
        inicio
            a = -123;
        fim
    `));
    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);

    t.equals(
        gerador.totalComandos,
        1,
        'Deve ter apenas um comando'
    );

    const instrucoes = gerador.comandos[0];
    t.equals(
        instrucoes.length,
        3,
        'O comando deve ter 3 instruções'
    );

    t.deepEqual(
        instrucoes.map(i => i.comoString()),
        [
            '= ( 123 ) -> <0>',
            '- ( <0> ) -> <1>',
            '= ( <1> ) -> a'
        ],
        'As instruções devem ser as esperadas'
    );

    t.end();
});

tape('Verificar código intermediário de uma atribuição complexa', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
            b: int;
            c: int;
            d: int;
        inicio
            a = b + c * d;
        fim
    `));
    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);

    t.equals(
        gerador.totalComandos,
        1,
        'Deve ter apenas um comando'
    );

    const instrucoes = gerador.comandos[0];
    t.equals(
        instrucoes.length,
        6,
        'O comando deve ter 6 instruções'
    );

    t.deepEqual(
        instrucoes.map(i => i.comoString()),
        [
            '= ( d ) -> <0>',
            '= ( c ) -> <1>',
            '* ( <1> <0> ) -> <2>',
            '= ( b ) -> <3>',
            '+ ( <3> <2> ) -> <4>',
            '= ( <4> ) -> a'
        ],
        'As instruções devem ser as esperadas'
    );

    t.end();
});

tape('Verificar código intermediário de uma atribuição bem complexa', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
            b: int;
            c: int;
            d: int;
            e: int;
            f: int;
            g: int;
            h: int;
            r: int;
        inicio
            r = (a + b) - (a - (c - d) * (e - f) + g)/h;
        fim
    `));
    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);

    t.equals(
        gerador.totalComandos,
        1,
        'Deve ter apenas um comando'
    );

    const instrucoes = gerador.comandos[0];
    t.equals(
        instrucoes.length,
        18,
        'O comando deve ter 18 instruções'
    );

    t.deepEqual(
        instrucoes.map(i => i.comoString()),
        [
            '= ( h ) -> <0>',
            '= ( g ) -> <1>',
            '= ( f ) -> <2>',
            '= ( e ) -> <3>',
            '- ( <3> <2> ) -> <4>',
            '= ( d ) -> <5>',
            '= ( c ) -> <6>',
            '- ( <6> <5> ) -> <7>',
            '* ( <7> <4> ) -> <8>',
            '= ( a ) -> <9>',
            '- ( <9> <8> ) -> <10>',
            '+ ( <10> <1> ) -> <11>',
            '/ ( <11> <0> ) -> <12>',
            '= ( b ) -> <13>',
            '= ( a ) -> <14>',
            '+ ( <14> <13> ) -> <15>',
            '- ( <15> <12> ) -> <16>',
            '= ( <16> ) -> r'
        ],
        'As instruções devem ser as esperadas'
    );

    t.end();
});

tape('Verificar código intermediário do comando retorne simples', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        inicio
            retorne 123;
        fim
    `));
    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);

    t.equals(
        gerador.totalComandos,
        1,
        'Deve ter apenas um comando'
    );

    const instrucoes = gerador.comandos[0];

    t.equals(
        instrucoes.length,
        2,
        'O comando deve ter 2 instruções'
    );

    t.deepEqual(
        instrucoes.map(i => i.comoString()),
        [
            '= ( 123 ) -> <0>',
            'retorne ( <0> ) -> retorne',
        ],
        'As instruções devem ser as esperadas'
    );

    t.end();
});

tape('Verificar otimização de código intermediário de uma atribuição', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
            b: int;
            c: int;
            d: int;
        inicio
            a = b + c * d;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);

    t.equals(
        gerador.totalComandos,
        1,
        'Deve ter apenas um comando'
    );

    let instrucoes = gerador.comandos[0];
    t.equals(
        instrucoes.length,
        6,
        'O comando deve ter 6 instruções'
    );

    instrucoes = gerador._otimizarAtribuicoes(instrucoes);

    t.equals(
        instrucoes.length,
        2,
        'O comando após otimização deve ter 2 instruções'
    );

    t.deepEqual(
        instrucoes.map(i => i.comoString()),
        [
            '* ( c d ) -> <0>',
            '+ ( b <0> ) -> a'
        ],
        'As instruções devem ser as esperadas'
    );

    t.end();
});

tape('Verificar otimização de código intermediário de uma atribuição', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
            b: int;
            c: int;
            d: int;
            e: int;
            f: int;
            g: int;
            h: int;
            r: int;
        inicio
            r = (a + b) - (a - (c - d) * (e - f) + g)/h;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);

    t.equals(
        gerador.totalComandos,
        1,
        'Deve ter apenas um comando'
    );

    let instrucoes = gerador.comandos[0];
    t.equals(
        instrucoes.length,
        18,
        'O comando deve ter 18 instruções'
    );

    instrucoes = gerador._otimizarAtribuicoes(instrucoes);

    t.equals(
        instrucoes.length,
        8,
        'O comando após otimização deve ter 8 instruções'
    );

    t.deepEqual(
        instrucoes.map(i => i.comoString()),
        [
            '- ( e f ) -> <0>',
            '- ( c d ) -> <1>',
            '* ( <1> <0> ) -> <2>',
            '- ( a <2> ) -> <3>',
            '+ ( <3> g ) -> <4>',
            '/ ( <4> h ) -> <5>',
            '+ ( a b ) -> <6>',
            '- ( <6> <5> ) -> r',
        ],
        'As instruções devem ser as esperadas'
    );

    t.end();
});

tape('Verificar otimização de código intermediário de uma atribuição', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
            r: int;
        inicio
            r = 0 + 0;
            r = a + 0;
            r = 0 + a;

            r = 0 - 0;
            r = a - 0;

            r = 1 * 1;
            r = a * 1;
            r = 1 * a;

            r = 1 / 1;
            r = a / 1;

            r = 1 % 1;
            r = a % 1;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);
    const resultados = [
        '= ( 0 ) -> r',
        '= ( a ) -> r',
        '= ( a ) -> r',

        '= ( 0 ) -> r',
        '= ( a ) -> r',

        '= ( 1 ) -> r',
        '= ( a ) -> r',
        '= ( a ) -> r',

        '= ( 1 ) -> r',
        '= ( a ) -> r',

        '= ( 0 ) -> r',
        '= ( 0 ) -> r',
    ];

    for (let i = 0; i < gerador.totalComandos; ++i) {
        const cmd = gerador.comandos[i];

        let instrucoes = gerador._otimizarAtribuicoes(cmd);
        instrucoes = gerador._otimizarComPropriedadesAlgebricas(instrucoes);
        t.equals(
            instrucoes[0].comoString(),
            resultados[i],
            'O comando otimizado com propriedades algebricas deve ser o esperado'
        );
    }

    t.end();
});

tape('Verificar otimização de código intermediário', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
            b: int;
            c: int;
            d: int;
            e: int;
            f: int;
        inicio
            a = (0 + 0) * 1;
            b = 5 % 1;
            c = (a * 1) + b;
            d = - 123 + 100;
            e = (a + d) % 1;
            f = b + c/2 - d;
            retorne ((a + 1) * c + (d - f)/e) % 2;
        fim
    `));

    const gerador = new Intermediario(semantico.validarComandos());
    const resultados = [
        [
            '= ( 0 ) -> <0>',
            '= ( <0> ) -> a'
        ],
        [
            '= ( 0 ) -> b'
        ],
        [
            '= ( a ) -> <0>',
            '+ ( <0> b ) -> c'
        ],
        [
            '- ( 123 ) -> <0>',
            '+ ( <0> 100 ) -> d'
        ],
        [
            '+ ( a d ) -> <0>',
            '= ( 0 ) -> e'
        ],
        [
            '/ ( c 2 ) -> <0>',
            '+ ( b <0> ) -> <1>',
            '- ( <1> d ) -> f'
        ],
        [
            '- ( d f ) -> <0>',
            '/ ( <0> e ) -> <1>',
            '+ ( a 1 ) -> <2>',
            '* ( <2> c ) -> <3>',
            '+ ( <3> <1> ) -> <4>',
            '% ( <4> 2 ) -> <5>',
            'retorne ( <5> ) -> retorne',
        ]
    ];

    const comandos = gerador.optimizar();
    for (let i = 0; i < comandos.length; ++i) {
        t.deepEqual(
            comandos[i].map(i => i.comoString()),
            resultados[i],
            'As instruções devem ser as esperadas'
        );
    }

    t.end();
});


tape('Verificar otimização de código intermediário de uma atribuição simples', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            r: int;
        inicio
            r = 123;
        fim
    `));

    const gerador = new Intermediario(semantico.validarComandos());
    const resultados = [
        [
            '= ( 123 ) -> r'
        ]
    ];

    const comandos = gerador.optimizar();
    for (let i = 0; i < comandos.length; ++i) {
        t.deepEqual(
            comandos[i].map(i => i.comoString()),
            resultados[i],
            'As instruções devem ser as esperadas'
        );
    }

    t.end();
});
