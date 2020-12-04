require = require('esm')(module);
const tape = require('tape');
const Sintatico = require('../../src/sintatico/Sintatico.mjs').default;
const Semantico = require('../../src/semantico/Semantico.mjs').default;

const sintatico = new Sintatico();

tape('Verificar tabela de símbolos com declarações de variáveis válidas', (t) => {

    const arvore = sintatico.parsear(`
        variaveis
            resultado: int;
            entrada: int;
        inicio fim
    `);

    const semantico = new Semantico(arvore);

    t.doesNotThrow(
        () => semantico.validarDeclaracoes(),
        'Não deve reportar erros'
    );

    const tabela = semantico.tabelaDeSimbolos;

    t.equals(
        tabela.length,
        2,
        'Devem conter duas declarações de variáveis na tabela'
    );

    t.equals(
        tabela[0].nome,
        'resultado',
        'A primeira variável da tabela deve ser o identificador "resultado"'
    );

    t.equals(
        tabela[0].tipo,
        'int',
        'A variável "resultado" deve ser do tipo  "int"'
    );

    t.equals(
        tabela[1].nome,
        'entrada',
        'A segunda variável da tabela deve ser o identificador "entrada"'
    );

    t.equals(
        tabela[1].tipo,
        'int',
        'A variável "entrada" deve ser do tipo  "int"'
    );

    t.end();
});

tape('Verificar tabela de símbolos com redeclarações de variável', (t) => {

    const arvore = sintatico.parsear(`
        variaveis
            resultado: int;
            resultado: int;
        inicio fim
    `);

    const semantico = new Semantico(arvore);

    t.throws(
        () => semantico.validarDeclaracoes(),
        (e) =>  typeof(e) === 'object' &&
                e.detalhes.atual.palavra === 'resultado' &&
                e.detalhes.tipo === 'redeclaracao',
        'Deve informar erro de redeclaração do símbolo "resultado"'
    );

    t.end();
});

tape('Verificar comando de atribuição simples válida', (t) => {

    const arvore = sintatico.parsear(`
        variaveis
            v: int;
        inicio
            v = 123;
        fim
    `);

    const semantico = new Semantico(arvore);
    let arvoreExpressoes = [];

    t.doesNotThrow(
        () => arvoreExpressoes = semantico.validarComandos(),
        'Não deve reportar erros'
    );

    t.equals(
        arvoreExpressoes.length,
        1,
        'Deve conter um comando'
    );

    const lexemas = [];
    arvoreExpressoes[0].emOrdem(n => lexemas.push(n.simbolo));

    t.deepEqual(
        lexemas,
        ['v', '123', '='],
        'A expressão em notação pós-fixa deve ser a esperada'
    );

    t.end();
});

tape('Verificar comando de atribuição complexa válida', (t) => {

    const arvore = sintatico.parsear(`
        variaveis
            a: int;
            b: int;
            c: int;
            d: int;
            v: int;
        inicio
            v = a - (b - a * (c + b/d));
        fim
    `);

    const semantico = new Semantico(arvore);
    let arvoreExpressoes = [];

    t.doesNotThrow(
        () => arvoreExpressoes = semantico.validarComandos(),
        'Não deve reportar erros'
    );

    t.equals(
        arvoreExpressoes.length,
        1,
        'Deve conter um comando'
    );

    const lexemas = [];
    arvoreExpressoes[0].emOrdem(n => lexemas.push(n.simbolo));

    t.deepEqual(
        lexemas,
        ['v', 'a', 'b', 'a', 'c', 'b', 'd', '/', '+', '*', '-', '-', '='],
        'A expressão em notação pós-fixa deve ser a esperada'
    );

    t.end();
});

tape('Verificar três comandos de atribuição válidos', (t) => {

    const arvore = sintatico.parsear(`
        variaveis
            a: int;
            b: int;
        inicio
            a = 123;
            b = 25 % 2;
            b = a * b;
        fim
    `);

    const semantico = new Semantico(arvore);
    let arvoreExpressoes = [];

    t.doesNotThrow(
        () => arvoreExpressoes = semantico.validarComandos(),
        'Não deve reportar erros'
    );

    t.equals(
        arvoreExpressoes.length,
        3,
        'Deve conter três comandos'
    );

    let lexemas = [];
    arvoreExpressoes[0].emOrdem(n => lexemas.push(n.simbolo));

    t.deepEqual(
        lexemas,
        ['a', '123', '='],
        'A primera expressão em notação pós-fixa deve ser a esperada'
    );

    lexemas = [];
    arvoreExpressoes[1].emOrdem(n => lexemas.push(n.simbolo));

    t.deepEqual(
        lexemas,
        ['b', '25', '2', '%', '='],
        'A segunda expressão em notação pós-fixa deve ser a esperada'
    );

    lexemas = [];
    arvoreExpressoes[2].emOrdem(n => lexemas.push(n.simbolo));

    t.deepEqual(
        lexemas,
        ['b', 'a', 'b', '*', '='],
        'A terceira expressão em notação pós-fixa deve ser a esperada'
    );

    t.end();
});

tape('Verificar comando de atribuição inválido', (t) => {

    const arvore = sintatico.parsear(`
        variaveis
            a: int;
        inicio
            a = 123 + b;
        fim
    `);

    const semantico = new Semantico(arvore);

    t.throws(
        () => semantico.validarComandos(),
        (e) =>  typeof(e) === 'object' &&
                e.detalhes.atual.palavra === 'b' &&
                e.detalhes.tipo === 'variavel-nao-declarada',
        'Deve informar erro de que a variavel "b" não foi declarada'
    );

    t.end();
});


tape('Verificar comando retorne válidos simples com literal', (t) => {

    const arvore = sintatico.parsear(`
        inicio
            retorne 123;
        fim
    `);

    const semantico = new Semantico(arvore);
    let arvoreExpressoes = [];

    t.doesNotThrow(
        () => arvoreExpressoes = semantico.validarComandos(),
        'Não deve reportar erros'
    );

    t.equals(
        arvoreExpressoes.length,
        1,
        'Deve conter apenas um comando retorne'
    );

    let lexemas = [];
    arvoreExpressoes[0].emOrdem(n => lexemas.push(n.simbolo));

    t.deepEqual(
        lexemas,
        ['123', 'retorne'],
        'A expressão retorne em notação pós-fixa deve ser a esperada'
    );

    t.end();
});

tape('Verificar comando retorne válidos com expressão', (t) => {

    const arvore = sintatico.parsear(`
        inicio
            retorne 25 % 5;
        fim
    `);

    const semantico = new Semantico(arvore);
    let arvoreExpressoes = [];

    t.doesNotThrow(
        () => arvoreExpressoes = semantico.validarComandos(),
        'Não deve reportar erros'
    );

    t.equals(
        arvoreExpressoes.length,
        1,
        'Deve conter apenas um comando retorne'
    );

    let lexemas = [];
    arvoreExpressoes[0].emOrdem(n => lexemas.push(n.simbolo));

    t.deepEqual(
        lexemas,
        ['25', '5', '%', 'retorne'],
        'A expressão retorne em notação pós-fixa deve ser a esperada'
    );

    t.end();
});

tape('Verificar comando retorne repetidos', (t) => {

    const arvore = sintatico.parsear(`
        inicio
            retorne 25 % 5;
            retorne 1 * 100;
        fim
    `);

    const semantico = new Semantico(arvore);
    t.throws(
        () => semantico.validarComandos(),
        (e) =>  typeof(e) === 'object' &&
                e.detalhes.atual[0].palavra === 'retorne' &&
                e.detalhes.tipo === 'multiplos-retorne',
        'Deve informar erro de multiplos comandos retorne'
    );

    t.end();
});
