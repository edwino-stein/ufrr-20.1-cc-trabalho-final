require = require('esm')(module);
const tape = require('tape');
const Lexema = require('../../src/lexico/Lexema.mjs').default;
const Token = require('../../src/lexico/Token.mjs').default;

tape('Verificar construtor de Lexema', (t) => {

    t.throws(
        () => new Lexema(),
        (e) => e instanceof TypeError && e.detalhes.nome === 'palavra',
        'Deve ocorrer erro pela falta da palavra do lexema'
    );

    t.throws(
        () => new Lexema(123),
        (e) => e instanceof TypeError && e.detalhes.nome === 'palavra',
        'Deve ocorrer por que a palavra do lexema não é uma string'
    );

    t.throws(
        () => new Lexema('palavra'),
        (e) => e instanceof TypeError && e.detalhes.nome === 'linha',
        'Deve ocorrer erro pela falta da linha de ocorrência do lexema'
    );

    t.throws(
        () => new Lexema('palavra', '123'),
        (e) => e instanceof TypeError && e.detalhes.nome === 'linha',
        'Deve ocorrer por que a linha de ocorrência do lexema não é um número'
    );

    t.throws(
        () => new Lexema('palavra', 123),
        (e) => e instanceof TypeError && e.detalhes.nome === 'coluna',
        'Deve ocorrer erro pela falta da coluna de ocorrência do lexema'
    );

    t.throws(
        () => new Lexema('palavra', 123, '321'),
        (e) => e instanceof TypeError && e.detalhes.nome === 'coluna',
        'Deve ocorrer por que a coluna de ocorrência do lexema não é um número'
    );

    t.throws(
        () => new Lexema('palavra', 123, 321),
        (e) => e instanceof TypeError && e.detalhes.nome === 'token',
        'Deve ocorrer erro pela falta do token do lexema'
    );

    t.throws(
        () => new Lexema('palavra', 123, 321, null),
        (e) => e instanceof TypeError && e.detalhes.nome === 'token',
        'Deve ocorrer por que a token do lexema não é uma instância de Token'
    );

    t.doesNotThrow(
        () => new Lexema('palavra', 123, 321, new Token('classe', 'subclasse')),
        'Não deve ocorrer erro quando todos parâmetros são válidos'
    );

    const token = new Token('classe', 'subclasse');
    const lexema = new Lexema('palavra', 123, 321, token);

    t.equals(
        lexema.palavra,
        'palavra',
        'A palavra deve ser a esperada'
    );

    t.equals(
        lexema.linha,
        123,
        'A linha deve ser a esperada'
    );

    t.equals(
        lexema.coluna,
        321,
        'A coluna deve ser a esperada'
    );

    t.equals(
        lexema.token,
        token,
        'O token deve ser o esperado'
    );

    t.equals(
        lexema.token.lexemas[0],
        lexema,
        'A lexema deve estar na lista de lexemas do token'
    );

    t.end();
});
