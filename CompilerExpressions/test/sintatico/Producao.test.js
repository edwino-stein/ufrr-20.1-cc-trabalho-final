require = require('esm')(module);
const tape = require('tape');
const Producao = require('../../src/sintatico/Producao.mjs').default;

tape('Verificar a estrutura de objetos de Producao', (t) => {

    const prod = new Producao('S', 'a b c d', 'e');
    t.equals(prod.cabeca, 'S', 'Símbolo da cabeca deve ser o esperado');
    t.deepEqual(prod.corpo, ['a', 'b', 'c', 'd'], 'Símbolos do corpo devem ser os esperados');
    t.equals(prod.corpoStr, 'a b c d', 'String concatenada do corpo deve ser como esperado');
    t.equals(prod.comoString, 'S -> a b c d', 'A string completa deve ser como esperado');

    t.end();
});

tape('Verificar a estrutura de objetos de Producao com símbolos de tamanho maior que 1', (t) => {

    const prod = new Producao('SENT', 'simb abc 123', 'e');
    t.equals(prod.cabeca, 'SENT', 'Símbolo da cabeca deve ser o esperado');
    t.deepEqual(prod.corpo, ['simb', 'abc', '123'], 'Símbolos do corpo devem ser os esperados');
    t.equals(prod.corpoStr, 'simb abc 123', 'String concatenada do corpo deve ser como esperado');
    t.equals(prod.comoString, 'SENT -> simb abc 123', 'A string completa deve ser como esperado');

    t.end();
});
