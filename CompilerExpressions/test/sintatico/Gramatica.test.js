require = require('esm')(module);
const tape = require('tape');
const Gramatica = require('../../src/sintatico/Gramatica.mjs').default;

tape('Verificar a estrutura de objetos de Gramatica', (t) => {

    const gram = new Gramatica(
        { 'L': ['e', '0', '1', '0 L 0', ' 1 L 1'] },
        'e'
    );

    t.deepEqual(
        gram._naoTerminais,
        [ 'L' ],
        'Deve ter o símbolo não terminal esperado'
    );

    t.deepEqual(
        gram._terminais,
        [ 'e', '0', '1' ],
        'Deve ter o símbolo terminais esperados'
    );

    t.ok(
        gram.simboloEhVazio('e'),
        'O símbolo vazio deve ser o esperado'
    );

    t.notOk(
        gram.simboloEhVazio('v'),
        'Não deve aceitar um símbolo diferente como vazio'
    );

    t.equals(
        gram.buscarProducoesPorNaoTerminal('L').length,
        5,
        'O símbolo não terminal "L" ter cinco produções definidas'
    );

    t.deepEqual(
        gram.producao('L', 0).corpo,
        [ 'e' ],
        'A primeira produção do não terminal deve ser vazio'
    );

    t.deepEqual(
        gram.producao('L', 4).corpo,
        [ ...'1L1' ],
        'A última produção do não terminal deve ser "1L1"'
    );

    t.throws(
        () => gram.producao('L', 5),
        (e) => e.message === 'Produção é inválida',
        'Deve ocorrer erro ao tentar recurar uma produção inexistente'
    );

    t.throws(
        () => gram.producao('l', 0),
        (e) => e.message === 'O símbolo não terminai não foi definido',
        'Deve ocorrer erro ao tentar recurar uma produção inexistente de um não terminal inexistente'
    );

    t.end();
});

tape('Verificar a estrutura de objetos de Gramatica com símblos de tamanhos maior que 1', (t) => {

    const gram = new Gramatica(
        {
            'EXP': ['VAR', 'EXP + EXP', 'EXP * EXP', '( EXP )'],
            'VAR': ['v1', 'var2', 'v']
        },
        '<vazio>'
    );

    t.deepEqual(
        gram._naoTerminais,
        [ 'EXP', 'VAR' ],
        'Deve ter o símbolo não terminal esperado'
    );

    t.deepEqual(
        gram._terminais,
        [ '+', '*', '(', ')', 'v1', 'var2', 'v' ],
        'Deve ter o símbolo terminais esperados'
    );

    t.ok(
        gram.simboloEhVazio('<vazio>'),
        'O símbolo vazio deve ser o esperado'
    );

    t.notOk(
        gram.simboloEhVazio('vazio'),
        'Não deve aceitar um símbolo diferente como vazio'
    );

    t.equals(
        gram.buscarProducoesPorNaoTerminal('EXP').length,
        4,
        'O símbolo não terminal "EXP" ter cinco produções definidas'
    );

    t.equals(
        gram.buscarProducoesPorNaoTerminal('VAR').length,
        3,
        'O símbolo não terminal "VAR" ter cinco produções definidas'
    );

    t.deepEqual(
        gram.producao('EXP', 0).corpo,
        [ 'VAR' ],
        'A primeira produção do não terminal "EXP" deve ser a esperada'
    );

    t.deepEqual(
        gram.producao('EXP', 1).corpo,
        [ 'EXP', '+', 'EXP' ],
        'A segunda produção do não terminal "EXP" deve ser a esperada'
    );

    t.deepEqual(
        gram.producao('EXP', 2).corpo,
        [ 'EXP', '*', 'EXP' ],
        'A terceira produção do não terminal "EXP" deve ser a esperada'
    );

    t.deepEqual(
        gram.producao('EXP', 3).corpo,
        [ '(', 'EXP', ')' ],
        'A quarta produção do não terminal "EXP" deve ser a esperada'
    );

    t.throws(
        () => gram.producao('EXP', 4),
        (e) => e.message === 'Produção é inválida',
        'Deve ocorrer erro ao tentar recurar uma produção inexistente de "EXP"'
    );

    t.deepEqual(
        gram.producao('VAR', 0).corpo,
        [ 'v1' ],
        'A primeira produção do não terminal "VAR" deve ser a esperada'
    );

    t.deepEqual(
        gram.producao('VAR', 1).corpo,
        [ 'var2' ],
        'A segunda produção do não terminal "VAR" deve ser a esperada'
    );

    t.deepEqual(
        gram.producao('VAR', 2).corpo,
        [ 'v' ],
        'A terceira produção do não terminal "VAR" deve ser a esperada'
    );

    t.throws(
        () => gram.producao('VAR', 3),
        (e) => e.message === 'Produção é inválida',
        'Deve ocorrer erro ao tentar recurar uma produção inexistente de "VAR"'
    );

    t.throws(
        () => gram.producao('NAOTERM', 0),
        (e) => e.message === 'O símbolo não terminai não foi definido',
        'Deve ocorrer erro ao tentar recurar uma produção inexistente de um não terminal inexistente'
    );

    t.end();
});
