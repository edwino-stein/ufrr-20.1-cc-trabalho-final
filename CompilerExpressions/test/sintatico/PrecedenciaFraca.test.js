require = require('esm')(module);
const tape = require('tape');
const Gramatica = require('../../src/sintatico/Gramatica.mjs').default;
const PrecedenciaFraca = require('../../src/sintatico/PrecedenciaFraca.mjs').default;
const LexicoBuffer = require('../../src/lexico/LexicoBuffer.mjs').default;
const Lexema = require('../../src/lexico/Lexema.mjs').default;
const Token = require('../../src/lexico/Token.mjs').default;
const getType = require('../../src/getType.mjs').default;

const F = new Gramatica(
    {
        'S': ['a S b', 'X c'],
        'X': ['d', 'e']
    },
    '#'
);

const G = new Gramatica(
    {
        '<exp>': ['<exp> + <ter>', '<ter>'],
        '<ter>': ['<ter> * <fat>', '<fat>'],
        '<fat>': ['( <exp> )', 'var']
    },
    '#'
);

tape('Verificar conjuntos ESQ e DIR da gramática F', (t) => {

    t.deepEqual(
        PrecedenciaFraca._esq(F),
        { S: [ 'a', 'X', 'd', 'e' ], X: [ 'd', 'e' ] },
        'O conjuto ESQ dos símbolos não terminais deve ser o esperado'
    );

    t.deepEqual(
        PrecedenciaFraca._dir(F),
        { S: [ 'b', 'c' ], X: [ 'd', 'e' ] },
        'O conjuto DIR dos símbolos não terminais deve ser o esperado'
    );

    t.end();
});

tape('Verificar conjuntos ESQ e DIR da gramática G', (t) => {

    t.deepEqual(
        PrecedenciaFraca._esq(G),
        {
            '<exp>': [ '<ter>', '<fat>', '(', 'var' ],
            '<ter>': [ '<fat>', '(', 'var' ],
            '<fat>': [ '(', 'var' ]
        },
        'O conjuto ESQ dos símbolos não terminais deve ser o esperado'
    );

    t.deepEqual(
        PrecedenciaFraca._dir(G),
        {
            '<exp>': [ '<ter>', '<fat>', ')', 'var' ],
            '<ter>': [ '<fat>', ')', 'var' ],
            '<fat>': [ ')', 'var' ] },
        'O conjuto DIR dos símbolos não terminais deve ser o esperado'
    );

    t.end();
});

tape('Verificar as relações Wirth-Weber da gramática F', (t) => {

    t.deepEqual(
        PrecedenciaFraca._calcularRegrasWirthWeber(F),
        [
            'S=b', 'X=c', 'a=S',
            'b>b', 'c>b', 'd>c',
            'e>c', 'a<a', 'a<X',
            'a<d', 'a<e'
        ],
        'O conjuto de regras deve ser o esperado'
    );

    t.deepEqual(
        PrecedenciaFraca._calcularRegrasWirthWeberComFdc(F, 'S', '$'),
        [
            'S=b', 'X=c', 'a=S',
            'b>b', 'c>b', 'd>c',
            'e>c', 'a<a', 'a<X',
            'a<d', 'a<e', '$<a',
            '$<X', '$<d', '$<e',
            'b>$', 'c>$'
        ],
        'O conjuto de regras com símbolo de fim de cadadeia deve ser o esperado'
    );

    t.end();
});

tape('Verificar as relações Wirth-Weber da gramática G', (t) => {

    t.deepEqual(
        PrecedenciaFraca._calcularRegrasWirthWeber(G),
        [
            '<exp>=+', '<exp>=)', '<ter>=*', '+=<ter>',
            '*=<fat>', '(=<exp>', '<ter>>+', '<fat>>+',
            ')>+', 'var>+', '<ter>>)', '<fat>>)',
            ')>)', 'var>)', '<fat>>*', ')>*',
            'var>*', '+<<fat>', '+<(', '+<var',
            '*<(', '*<var', '(<<ter>', '(<<fat>',
            '(<(', '(<var'
        ],
        'O conjuto de regras deve ser o esperado'
    );

    t.deepEqual(
        PrecedenciaFraca._calcularRegrasWirthWeberComFdc(G, '<exp>', '$'),
        [
            '<exp>=+', '<exp>=)', '<ter>=*', '+=<ter>',
            '*=<fat>', '(=<exp>', '<ter>>+', '<fat>>+',
            ')>+', 'var>+', '<ter>>)', '<fat>>)',
            ')>)', 'var>)', '<fat>>*', ')>*',
            'var>*', '+<<fat>', '+<(', '+<var',
            '*<(', '*<var', '(<<ter>', '(<<fat>',
            '(<(', '(<var', '$<<ter>', '$<<fat>', '$<(', '$<var',
            '<ter>>$', '<fat>>$', ')>$', 'var>$'
        ],
        'O conjuto de regras com símbolo de fim de cadadeia deve ser o esperado'
    );

    t.end();
});

tape('Verificar tabela DR da gramática F', (t) => {

    const tabelaDRF = PrecedenciaFraca._criarTabelaDR(F, 'S', '$');

    t.deepEqual(
        tabelaDRF['S'],
        { 'a': null, 'b': 'D', 'c': null, 'd': null, 'e': null, '$': null},
        'A linha do símbolo "S" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['X'],
        { 'a': null, 'b': null, 'c': 'D', 'd': null, 'e': null, '$': null},
        'A linha do símbolo "X" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['a'],
        { 'a': 'D', 'b': null, 'c': null, 'd': 'D', 'e': 'D', '$': null},
        'A linha do símbolo "a" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['b'],
        { 'a': null, 'b': 'R', 'c': null, 'd': null, 'e': null, '$': 'R'},
        'A linha do símbolo "b" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['c'],
        { 'a': null, 'b': 'R', 'c': null, 'd': null, 'e': null, '$': 'R'},
        'A linha do símbolo "c" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['d'],
        { 'a': null, 'b': null, 'c': 'R', 'd': null, 'e': null, '$': null},
        'A linha do símbolo "d" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['e'],
        { 'a': null, 'b': null, 'c': 'R', 'd': null, 'e': null, '$': null},
        'A linha do símbolo "e" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['$'],
        { 'a': 'D', 'b': null, 'c': null, 'd': 'D', 'e': 'D', '$': null},
        'A linha do símbolo "$" deve ser a esperada'
    );

    t.end();
});

tape('Verificar tabela DR da gramática G', (t) => {

    const tabelaDRG = PrecedenciaFraca._criarTabelaDR(G, '<exp>', '$');

    t.deepEqual(
        tabelaDRG['<exp>'],
        { '+': 'D', '*': null, '(': null, ')': 'D', 'var': null , '$': null },
        'A linha do símbolo "<exp>" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['<ter>'],
        { '+': 'R', '*': 'D', '(': null, ')': 'R', 'var': null , '$': 'R' },
        'A linha do símbolo "<ter>" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['<fat>'],
        { '+': 'R', '*': 'R', '(': null, ')': 'R', 'var': null , '$': 'R' },
        'A linha do símbolo "<fat>" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['+'],
        { '+': null, '*': null, '(': 'D', ')': null, 'var': 'D' , '$': null },
        'A linha do símbolo "+" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['*'],
        { '+': null, '*': null, '(': 'D', ')': null, 'var': 'D' , '$': null },
        'A linha do símbolo "*" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['('],
        { '+': null, '*': null, '(': 'D', ')': null, 'var': 'D' , '$': null },
        'A linha do símbolo "(" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG[')'],
        { '+': 'R', '*': 'R', '(': null, ')': 'R', 'var': null , '$': 'R' },
        'A linha do símbolo ")" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['var'],
        { '+': 'R', '*': 'R', '(': null, ')': 'R', 'var': null , '$': 'R' },
        'A linha do símbolo "v" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['$'],
        { '+': null, '*': null, '(': 'D', ')': null, 'var': 'D' , '$': null },
        'A linha do símbolo "$" deve ser a esperada'
    );

    t.end();
});

tape('Verificar o construtor de PrecedenciaFraca', (t) => {

    t.throws(
        () => new PrecedenciaFraca(),
        (e) => e instanceof TypeError && e.detalhes.nome === 'gram',
        'Deve ocorrer erro pela falta da gramática'
    );

    t.throws(
        () => new PrecedenciaFraca(null),
        (e) => e instanceof TypeError && e.detalhes.nome === 'gram',
        'Deve ocorrer por que a gramática não é uma instância de Gramatica'
    );

    t.throws(
        () => new PrecedenciaFraca(F),
        (e) => e instanceof TypeError && e.detalhes.nome === 'inicial',
        'Deve ocorrer erro pela falta do símbolo inicial'
    );

    t.throws(
        () => new PrecedenciaFraca(F, 'a'),
        (e) => e.message === 'O símbolo inicial deve ser um símbolo não terminal da gramática',
        'Deve ocorrer erro pois o símbolo inicial não é um símbolo não terminal'
    );

    t.throws(
        () => new PrecedenciaFraca(F, 'S'),
        (e) => e instanceof TypeError && e.detalhes.nome === 'fdc',
        'Deve ocorrer erro pela falta do símbolo de fim de cadeia'
    );

    t.throws(
        () => new PrecedenciaFraca(F, 'S', 'X'),
        (e) => e.message === 'O símbolo de fim de cadeia não pode ser um símbolo não terminal da gramática',
        'Deve ocorrer erro pois o símbolo de fim de cadeia é um símbolo não terminal'
    );

    t.throws(
        () => new PrecedenciaFraca(F, 'S', '#'),
        (e) => e.message === 'O símbolo de fim de cadeia não pode ser um símbolo terminal conhecido da gramática',
        'Deve ocorrer erro pois o símbolo de fim de cadeia é um símbolo terminal conhecido'
    );

    t.doesNotThrow(
        () => new PrecedenciaFraca(F, 'S', '$'),
        'Não deve ocorrer erro com todos parâmetros válidos'
    );

    const precedenciaFraca = new PrecedenciaFraca(F, 'S', '$');
    t.equals(precedenciaFraca._inicial, 'S', 'O símbolo inicial deve ser o esperado');
    t.equals(precedenciaFraca._fdc, '$', 'O símbolo de fim de cadeia deve ser o esperado');
    t.equals(precedenciaFraca._gramatica, F, 'A gramática deve ser a esperada');

    t.deepEqual(
        precedenciaFraca._tabelaDR,
        PrecedenciaFraca._criarTabelaDR(F, 'S', '$'),
        'A tabela DR deve ser a esperada'
    );

    t.end();
});

tape('Verificar análise com a gramática F', (t) => {

    const precedenciaFraca = new PrecedenciaFraca(F, 'S', '$');

    t.doesNotThrow(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => [...s], '$', 'aadcbb'
        )),
        'Deve reconhecer a entrada "aadcbb"'
    );

    t.end();
});

tape('Verificar análise com a gramática G', (t) => {

    const precedenciaFraca = new PrecedenciaFraca(G, '<exp>', '$');

    t.doesNotThrow(
        () => precedenciaFraca.analisar(
            new LexicoBuffer((s, l) => s.split(' '), '$', ['var'])
        ),
        'Deve reconhecer a entrada "var"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar(
            new LexicoBuffer((s, l) => s.split(' '), '$', ['( var )'])
        ),
        'Deve reconhecer a entrada "( var )"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar(
            new LexicoBuffer((s, l) => s.split(' '), '$', ['var + var'])
        ),
        'Deve reconhecer a entrada "var + var"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' '), '$', ['var * var']
        )),
        'Deve reconhecer a entrada "var * var"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' '), '$', ['( var ) + var']
        )),
        'Deve reconhecer a entrada "( var ) + var"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' '), '$', ['( var ) * var']
        )),
        'Deve reconhecer a entrada "( var ) * var"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' '), '$', ['var + var * var']
        )),
        'Deve reconhecer a entrada "var + var * var"'
    );

    t.throws(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' '), '$', ['']
        )),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada ""'
    );

    t.throws(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' '), '$', ['var *']
        )),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "var *"'
    );

    t.throws(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' '), '$', ['var + *']
        )),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "var + *"'
    );

    t.throws(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' '), '$', ['( )']
        )),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "( )"'
    );

    t.throws(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' '), '$', ['var + invalido']
        )),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "var + invalido"'
    );

    t.throws(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' '), '$', ['( var + var ) * ( var']
        )),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "( var + var ) * ( var"'
    );

    t.end();
});

tape('Verificar análise com a gramática G com Lexemas', (t) => {

    const precedenciaFraca = new PrecedenciaFraca(G, '<exp>', '$');
    const criarLexema = (lex) => new Lexema(lex, 0, 0, new Token(lex, ''));

    t.doesNotThrow(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' ').map(criarLexema),
            '$',
            'var'
        )),
        'Deve reconhecer a entrada "var"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' ').map(criarLexema),
            '$',
            'var + var'
        )),
        'Deve reconhecer a entrada "var + var"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' ').map(criarLexema),
            '$',
            'var * var'
        )),
        'Deve reconhecer a entrada "var * var"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' ').map(criarLexema),
            '$',
            '( var + var ) * var'
        )),
        'Deve reconhecer a entrada "( var + var ) * var"'
    );

    t.throws(
        () => precedenciaFraca.analisar(new LexicoBuffer(
            (s, l) => s.split(' ').map(criarLexema),
            '$',
            ['var + *']
        )),
        (e) =>  typeof(e) === 'object' &&
                getType(e.detalhes.encontrado) === 'Lexema' &&
                e.detalhes.encontrado.palavra === '*',
        'Não deve reconhecer a entrada "var + *" e deve retornar a lexema encontrada'
    );

    t.end();
});
