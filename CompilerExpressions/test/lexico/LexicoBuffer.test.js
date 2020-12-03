require = require('esm')(module);
const tape = require('tape');
const LexicoBuffer = require('../../src/lexico/LexicoBuffer.mjs').default;
const Lexico = require('../../src/lexico/Lexico.mjs').default;

tape('Verificar construtor de LexicoBuffer', (t) => {

    t.throws(
        () => new LexicoBuffer(),
        (e) => e instanceof TypeError && e.detalhes.nome === 'handle',
        'Deve ocorrer erro pela falta da função handle'
    );

    t.throws(
        () => new LexicoBuffer(123),
        (e) => e instanceof TypeError && e.detalhes.nome === 'handle',
        'Deve ocorrer por que a função handle não é do tipo function'
    );

    t.throws(
        () => new LexicoBuffer(() => {}),
        (e) => e instanceof TypeError && e.detalhes.nome === 'eof',
        'Deve ocorrer erro pela falta do símbolo de fim de arquivo'
    );

    t.throws(
        () => new LexicoBuffer(() => {}, 123),
        (e) => e instanceof TypeError && e.detalhes.nome === 'eof',
        'Deve ocorrer por que a símbolo de fim não é do tipo string'
    );

    t.throws(
        () => new LexicoBuffer(() => {}, 'eof'),
        (e) => e instanceof TypeError && e.detalhes.nome === 'entrada',
        'Deve ocorrer erro pela falta da entrada'
    );

    t.throws(
        () => new LexicoBuffer(() => {}, 'eof', null),
        (e) => e instanceof TypeError && e.detalhes.nome === 'entrada',
        'Deve ocorrer por que a entrada não é do tipo string ou Array'
    );

    t.doesNotThrow(
        () => new LexicoBuffer(() => {}, 'eof', ''),
        'Não deve ocorrer erro quando todos parâmetros são válidos (entrada string)'
    );

    t.doesNotThrow(
        () => new LexicoBuffer(() => {}, 'eof', []),
        'Não deve ocorrer erro quando todos parâmetros são válidos (entrada Array)'
    );

    t.end();
});

tape('Verificar o retorno de proximo() com entrada do tipo Array', (t) => {

    const buffer = new LexicoBuffer(
        (e, l) => e.split(' '),
        'eof',
        ['token11 token12', 'token21', 'token31 token32']
    );

    t.equals(buffer.proximo, 'token11', 'Deve ser "token11"');
    t.equals(buffer.proximo, 'token12', 'Deve ser "token12"');
    t.equals(buffer.proximo, 'token21', 'Deve ser "token21"');
    t.equals(buffer.proximo, 'token31', 'Deve ser "token31"');
    t.equals(buffer.proximo, 'token32', 'Deve ser "token32"');
    t.equals(buffer.proximo, 'eof', 'Deve ser "eof"');

    t.end();
});

tape('Verificar o retorno de proximo() com entrada do tipo string', (t) => {

    const buffer = new LexicoBuffer(
        (e, l) => e.split(' '),
        'eof',
        "token11 token12\ntoken21\ntoken31 token32"
    );

    t.equals(buffer.proximo, 'token11', 'Deve ser "token11"');
    t.equals(buffer.proximo, 'token12', 'Deve ser "token12"');
    t.equals(buffer.proximo, 'token21', 'Deve ser "token21"');
    t.equals(buffer.proximo, 'token31', 'Deve ser "token31"');
    t.equals(buffer.proximo, 'token32', 'Deve ser "token32"');
    t.equals(buffer.proximo, 'eof', 'Deve ser "eof"');

    t.end();
});

tape('Verificar o retorno de proximo() com parseador lexico e entrada do tipo string simples', (t) => {

    const lexico = new Lexico();
    const buffer = new LexicoBuffer(
        lexico.tokenizarHandle,
        'eof',
        "inicio abc = 123 fim"
    );

    t.equals(buffer.proximo.palavra, 'inicio', 'Deve ser "inicio"');
    t.equals(buffer.proximo.palavra, 'abc', 'Deve ser "abc"');
    t.equals(buffer.proximo.palavra, '=', 'Deve ser "="');
    t.equals(buffer.proximo.palavra, '123', 'Deve ser "123"');
    t.equals(buffer.proximo.palavra, 'fim', 'Deve ser "fim"');
    t.equals(buffer.proximo, 'eof', 'Deve ser "eof"');

    t.end();
});

tape('Verificar o retorno de proximo() com parseador lexico e entrada do tipo string com quebras de linha', (t) => {

    const lexico = new Lexico();
    const buffer = new LexicoBuffer(
        lexico.tokenizarHandle,
        'eof',
        "inicio\nabc = 123\nfim"
    );

    t.equals(buffer.proximo.palavra, 'inicio', 'Deve ser "inicio"');
    t.equals(buffer.proximo.palavra, 'abc', 'Deve ser "abc"');
    t.equals(buffer.proximo.palavra, '=', 'Deve ser "="');
    t.equals(buffer.proximo.palavra, '123', 'Deve ser "123"');
    t.equals(buffer.proximo.palavra, 'fim', 'Deve ser "fim"');
    t.equals(buffer.proximo, 'eof', 'Deve ser "eof"');

    t.end();
});

tape('Verificar o retorno de proximo() com parseador lexico e entrada do tipo string com quebras de linha (CRLF)', (t) => {

    const lexico = new Lexico();
    const buffer = new LexicoBuffer(
        lexico.tokenizarHandle,
        'eof',
        "inicio\r\nabc = 123\r\nfim"
    );

    t.equals(buffer.proximo.palavra, 'inicio', 'Deve ser "inicio"');
    t.equals(buffer.proximo.palavra, 'abc', 'Deve ser "abc"');
    t.equals(buffer.proximo.palavra, '=', 'Deve ser "="');
    t.equals(buffer.proximo.palavra, '123', 'Deve ser "123"');
    t.equals(buffer.proximo.palavra, 'fim', 'Deve ser "fim"');
    t.equals(buffer.proximo, 'eof', 'Deve ser "eof"');

    t.end();
});

tape('Verificar o retorno de proximo() com parseador lexico e entrada do tipo string de multiplas linhas', (t) => {

    const lexico = new Lexico();
    const buffer = new LexicoBuffer(
        lexico.tokenizarHandle,
        'eof',
        `
            inicio
                abc = 123
            fim
        `
    );

    t.equals(buffer.proximo.palavra, 'inicio', 'Deve ser "inicio"');
    t.equals(buffer.proximo.palavra, 'abc', 'Deve ser "abc"');
    t.equals(buffer.proximo.palavra, '=', 'Deve ser "="');
    t.equals(buffer.proximo.palavra, '123', 'Deve ser "123"');
    t.equals(buffer.proximo.palavra, 'fim', 'Deve ser "fim"');
    t.equals(buffer.proximo, 'eof', 'Deve ser "eof"');

    t.end();
});
