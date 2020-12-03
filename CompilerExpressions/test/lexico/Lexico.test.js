require = require('esm')(module);
const tape = require('tape');
const Lexico = require('../../src/lexico/Lexico.mjs').default;
const Padroes = require('../../src/lexico/Padroes.mjs').default;

tape('Quebrar a string de entrada nos lugares que ocorrer strings literais', (t) => {

    t.deepEqual(
        Lexico._separarPorStringLiterais('abc"def"ghi'),
        ['abc', '"def"', 'ghi'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorStringLiterais('"abc"defghi'),
        ['"abc"', 'defghi'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorStringLiterais('abcdef"ghi"'),
        ['abcdef', '"ghi"'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorStringLiterais('abcdef"ghi'),
        ['abcdef"ghi'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorStringLiterais('var = "str + legal" - foo ("la la") * lala'),
        ['var = ', '"str + legal"', ' - foo (', '"la la"', ') * lala'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorStringLiterais(''),
        [],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.end();
});

tape('Quebrar a string de entrada nos lugares que ocorrer espaços', (t) => {

    t.deepEqual(
        Lexico._separarPorEspacos('abc def ghf'),
        ['abc', ' ', 'def', ' ', 'ghf'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorEspacos(' abcdef ghf'),
        [' ', 'abcdef', ' ', 'ghf'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorEspacos(' abcdefghf '),
        [' ', 'abcdefghf', ' '],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorEspacos('  '),
        ['  '],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorEspacos('var = str + legal - foo'),
        ['var', ' ', '=', ' ', 'str', ' ', '+', ' ', 'legal', ' ', '-', ' ', 'foo'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorEspacos(''),
        [],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.end();
});

tape('Quebrar a string de entrada nos lugares que ocorrer operadores s símbolos especiais', (t) => {

    t.deepEqual(
        Lexico._separarPorOperadores('a=b+c'),
        ['a', '=', 'b', '+', 'c'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorOperadores('123var1=*(var)2;'),
        ['123var1', '=', '*', '(', 'var', ')', '2', ';'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorOperadores('var123=pow(2,3)%4'),
        ['var123', '=', 'pow', '(', '2', ',', '3', ')', '%', '4'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._separarPorOperadores('var123'),
        ['var123'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.end();
});

tape('Quebrar a string de entrada em lexemas válidas e espeços', (t) => {

    t.deepEqual(
        Lexico._parsearLexemas('a=b - c/2'),
        ['a', '=', 'b', ' ', '-', ' ', 'c', '/', '2'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._parsearLexemas('str = "str + cool"+"concat" +foo'),
        ['str', ' ', '=', " ",  '"str + cool"', '+', '"concat"', ' ', '+', 'foo'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._parsearLexemas('var+"str+cool"'),
        ['var', '+', '"str+cool"'],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._parsearLexemas('123var1=*(var)2 + var3/((2'),
        [
            '123var1', '=', '*', '(', 'var', ')', '2', ' ', '+', ' ',
            'var3', '/', '(', '(', '2'
        ],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.deepEqual(
        Lexico._parsearLexemas('var1 =var2 + var3/2 * (var4 - 123)'),
        [
            'var1', ' ', '=', 'var2', ' ', '+', ' ', 'var3', '/', '2',
            ' ', '*',' ', '(', 'var4', ' ', '-', ' ', '123', ')'
        ],
        'A string deve ser quebrada apenas nos lugares certos'
    );

    t.end();
})

tape('Verificar casamento de tokens com strings de lexemas de todos os símbolos e padroes da linguagem', (t) => {

    const lexico = new Lexico();

    for (const l of Padroes.nomeEscalares) {
        t.equals(
            lexico._buscarTokenPelaLexema(l).classe,
            'nome-escalar',
            'A lexema "'+l+'" deve retornar a classe "nome-escalar"'
        );
    }

    for (const l of Padroes.palavras) {
        t.equals(
            lexico._buscarTokenPelaLexema(l).classe,
            'comando',
            'A lexema "'+l+'" deve retornar a classe "comando"'
        );
    }

    for (const l of Padroes.opAritmeticos) {
        t.equals(
            lexico._buscarTokenPelaLexema(l).classe,
            'op-aritmetico',
            'A lexema "'+l+'" deve retornar a classe "op-aritmetico"'
        );
    }

    for (const l of Padroes.especiais) {
        t.equals(
            lexico._buscarTokenPelaLexema(l).classe,
            'especial',
            'A lexema "'+l+'" deve retornar a classe "especial"'
        );
    }

    for (const l of ['"string"', '"uma string"', '""', '" "']) {
        t.equals(
            lexico._buscarTokenPelaLexema(l).classe,
            'literal-string',
            'A lexema "'+l+'" deve retornar a classe "literal-string"'
        );
    }

    for (const l of ['0', '123', '0123', '0x12AB', '0xabCD']) {
        t.equals(
            lexico._buscarTokenPelaLexema(l).classe,
            'litaral-int',
            'A lexema "'+l+'" deve retornar a classe "litaral-int"'
        );
    }

    for (const l of ['variavel', '_variavel', 'num123', 'num_123', '_1_a_B_2_']) {
        t.equals(
            lexico._buscarTokenPelaLexema(l).classe,
            'identificador',
            'A lexema "'+l+'" deve retornar a classe "identificador"'
        );
    }

    for (const l of ['123_var', '+-1*%', 'var-inicio', '0000', '@invalido$']) {
        t.equals(
            lexico._buscarTokenPelaLexema(l).classe,
            'sem-categoria',
            'A lexema "'+l+'" deve retornar a classe "sem-categoria"'
        );
    }

    t.end();
});

tape('Verificar casamento de tokens para a string "var1 + c/2;"', (t) => {

    const lexico = new Lexico();
    const lexemas = lexico.tokenizarLinha('var1 + c/2;', 0);

    t.equals(
        lexemas[0].palavra,
        'var1',
        'lexemas[0].palavra deve ser igual a "var1"'
    );

    t.equals(
        lexemas[0].coluna,
        0,
        'lexemas[0].coluna deve ser igual a 0'
    );

    t.equals(
        lexemas[0].token.tipo,
        'identificador',
        'lexemas[0].token.tipo deve ser igual a "identificador"'
    );

    t.equals(
        lexemas[1].palavra,
        '+',
        'lexemas[1].palavra deve ser igual a "+"'
    );

    t.equals(
        lexemas[1].coluna,
        5,
        'lexemas[1].coluna deve ser igual a 5'
    );

    t.equals(
        lexemas[1].token.tipo,
        'op-aritmetico-adi',
        'lexemas[1].token.tipo deve ser igual a "op-aritmetico-adi"'
    );

    t.equals(
        lexemas[2].palavra,
        'c',
        'lexemas[2].palavra deve ser igual a "c"'
    );

    t.equals(
        lexemas[2].coluna,
        7,
        'lexemas[2].coluna deve ser igual a 7'
    );

    t.equals(
        lexemas[2].token.tipo,
        'identificador',
        'lexemas[2].token.tipo deve ser igual a "identificador"'
    );

    t.equals(
        lexemas[3].palavra,
        '/',
        'lexemas[3].palavra deve ser igual a "/"'
    );

    t.equals(
        lexemas[3].coluna,
        8,
        'lexemas[3].coluna deve ser igual a 8'
    );

    t.equals(
        lexemas[3].token.tipo,
        'op-aritmetico-div',
        'lexemas[3].token.tipo deve ser igual a "op-aritmetico-div"'
    );

    t.equals(
        lexemas[4].palavra,
        '2',
        'lexemas[4].palavra deve ser igual a "2"'
    );

    t.equals(
        lexemas[4].coluna,
        9,
        'lexemas[4].coluna deve ser igual a 9'
    );

    t.equals(
        lexemas[4].token.tipo,
        'litaral-int',
        'lexemas[4].token.tipo deve ser igual a "litaral-int"'
    );

    t.equals(
        lexemas[5].palavra,
        ';',
        'lexemas[5].palavra deve ser igual a ";"'
    );

    t.equals(
        lexemas[5].coluna,
        10,
        'lexemas[5].coluna deve ser igual a 10'
    );

    t.equals(
        lexemas[5].token.tipo,
        'especial-del',
        'lexemas[5].token.tipo deve ser igual a "especial-del"'
    );

    t.end();
});

tape('Verificar casamento de tokens para a string "str = "str + cool" +"concat""', (t) => {

    const lexico = new Lexico();
    const lexemas = lexico.tokenizarLinha('str = "str + cool" +"concat"', 0);

    t.equals(
        lexemas[0].palavra,
        'str',
        'lexemas[0].palavra deve ser igual a "str"'
    );

    t.equals(
        lexemas[0].coluna,
        0,
        'lexemas[0].coluna deve ser igual a 0'
    );

    t.equals(
        lexemas[0].token.tipo,
        'identificador',
        'lexemas[0].token.tipo deve ser igual a "identificador"'
    );

    t.equals(
        lexemas[1].palavra,
        '=',
        'lexemas[1].palavra deve ser igual a "="'
    );

    t.equals(
        lexemas[1].coluna,
        4,
        'lexemas[1].coluna deve ser igual a 4'
    );

    t.equals(
        lexemas[1].token.tipo,
        'especial-atr',
        'lexemas[1].token.tipo deve ser igual a "especial-atr"'
    );

    t.equals(
        lexemas[2].palavra,
        '"str + cool"',
        'lexemas[2].palavra deve ser igual a ""str + cool""'
    );

    t.equals(
        lexemas[2].coluna,
        6,
        'lexemas[2].coluna deve ser igual a 6'
    );

    t.equals(
        lexemas[2].token.tipo,
        'literal-string',
        'lexemas[2].token.tipo deve ser igual a "literal-string"'
    );

    t.equals(
        lexemas[3].palavra,
        '+',
        'lexemas[3].palavra deve ser igual a "+"'
    );

    t.equals(
        lexemas[3].coluna,
        19,
        'lexemas[3].coluna deve ser igual a 19'
    );

    t.equals(
        lexemas[3].token.tipo,
        'op-aritmetico-adi',
        'lexemas[3].token.tipo deve ser igual a "op-aritmetico-adi"'
    );

    t.equals(
        lexemas[4].palavra,
        '"concat"',
        'lexemas[4].palavra deve ser igual a ""concat""'
    );

    t.equals(
        lexemas[4].coluna,
        20,
        'lexemas[4].coluna deve ser igual a 20'
    );

    t.equals(
        lexemas[4].token.tipo,
        'literal-string',
        'lexemas[4].token.tipo deve ser igual a "literal-string"'
    );

    t.end();
});

tape('Verificar casamento de tokens para a string "123abc"', (t) => {

    const lexico = new Lexico();

    t.throws(
        () => lexico.tokenizarLinha('123abc', 0),
        (e) => typeof(e) === 'object' && e.detalhes.encontrado.palavra === '123abc',
        'Não deve reconhecer a entrada'
    );

    t.end();
});
