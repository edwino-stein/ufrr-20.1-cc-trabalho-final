require = require('esm')(module);
const tape = require('tape');
const Sintatico = require('../../src/sintatico/Sintatico.mjs').default;
const Semantico = require('../../src/semantico/Semantico.mjs').default;

const sintatico = new Sintatico();

tape('Verificar tabela de símbolos com declarações de variáveis válidas', (t) => {

    const arvore = sintatico.parsear(`
        var:
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
        var:
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
        'Deve informar erro erro de redeclaração do símbolo "resultado"'
    );

    t.end();
});

