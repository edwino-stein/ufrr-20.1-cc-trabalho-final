require = require('esm')(module);
const tape = require('tape');
const Sintatico = require('../../src/sintatico/Sintatico.mjs').default;
const Semantico = require('../../src/semantico/Semantico.mjs').default;
const Intermediario = require('../../src/sintese/Intermediario.mjs').default;
const Instrucao = require('../../src/sintese/Instrucao.mjs').default;
const Mips = require('../../src/sintese/Mips.mjs').default;

const sintatico = new Sintatico();

const gerarAssembly = (dados, texto) => {
return `.data
${dados.map(d => [d.nome, ': .', d.diretiva, ' ', d.valor].join('')).join("\n") }
${"\n"}
.text
${texto.map(i => [i.operador, [i.operando, ...i.argumentos].join(', ')].join(' ')).join("\n") }
`;
}

tape('Verificar código MIPS de uma atribuição simples', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            r: int;
        inicio
            r = 123;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);
    const instrucoes = gerador.optimizar();
    const mips = new Mips(semantico.tabelaDeSimbolos);

    for (const inst of instrucoes) mips.adicionarInstrucoes(inst);

    t.deepEqual(
        mips.blocoDados.map(d => [d.nome, d.diretiva, d.valor].join(' ')),
        [
            'id_int_r word 0'
        ],
        'O bloco de dados deve ser o esperado'
    );

    t.deepEqual(
        mips.blocoTexto.map(i => i.comoString()),
        [
            'addi ( $zero 123 ) -> $t0',
            'sw ( id_int_r ) -> $t0',
        ],
        'As instruções assembly devem ser as esperadas'
    );

    console.log('Código assembly:\n', gerarAssembly(mips.blocoDados, mips.blocoTexto));
    t.end();
});

tape('Verificar código MIPS de uma adição', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
            r: int;
        inicio
            a = 5;
            r = 10 + a;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);
    const instrucoes = gerador.optimizar();
    const mips = new Mips(semantico.tabelaDeSimbolos);
    for (const inst of instrucoes) mips.adicionarInstrucoes(inst);

    t.deepEqual(
        mips.blocoDados.map(d => [d.nome, d.diretiva, d.valor].join(' ')),
        [
            'id_int_a word 0',
            'id_int_r word 0'
        ],
        'O bloco de dados deve ser o esperado'
    );

    t.deepEqual(
        mips.blocoTexto.map(i => i.comoString()),
        [
            'addi ( $zero 5 ) -> $t0',
            'sw ( id_int_a ) -> $t0',
            'addi ( $zero 10 ) -> $t0',
            'lw ( id_int_a ) -> $t1',
            'add ( $t0 $t1 ) -> $t0',
            'sw ( id_int_r ) -> $t0'
        ],
        'As instruções assembly devem ser as esperadas'
    );

    console.log('Código assembly:\n', gerarAssembly(mips.blocoDados, mips.blocoTexto));
    t.end();
});

tape('Verificar código MIPS de uma subtração', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
            r: int;
        inicio
            a = 5;
            r = a - 10;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);
    const instrucoes = gerador.optimizar();
    const mips = new Mips(semantico.tabelaDeSimbolos);
    for (const inst of instrucoes) mips.adicionarInstrucoes(inst);

    t.deepEqual(
        mips.blocoDados.map(d => [d.nome, d.diretiva, d.valor].join(' ')),
        [
            'id_int_a word 0',
            'id_int_r word 0'
        ],
        'O bloco de dados deve ser o esperado'
    );

    t.deepEqual(
        mips.blocoTexto.map(i => i.comoString()),
        [
            'addi ( $zero 5 ) -> $t0',
            'sw ( id_int_a ) -> $t0',
            'lw ( id_int_a ) -> $t0',
            'addi ( $zero 10 ) -> $t1',
            'sub ( $t0 $t1 ) -> $t0',
            'sw ( id_int_r ) -> $t0'
        ],
        'As instruções assembly devem ser as esperadas'
    );

    console.log('Código assembly:\n', gerarAssembly(mips.blocoDados, mips.blocoTexto));
    t.end();
});

tape('Verificar código MIPS de uma atribuição de número negativo', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
            r: int;
        inicio
            a = 5;
            r = - a;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);
    const instrucoes = gerador.optimizar();
    const mips = new Mips(semantico.tabelaDeSimbolos);
    for (const inst of instrucoes) mips.adicionarInstrucoes(inst);

    t.deepEqual(
        mips.blocoDados.map(d => [d.nome, d.diretiva, d.valor].join(' ')),
        [
            'id_int_a word 0',
            'id_int_r word 0'
        ],
        'O bloco de dados deve ser o esperado'
    );

    t.deepEqual(
        mips.blocoTexto.map(i => i.comoString()),
        [
            'addi ( $zero 5 ) -> $t0',
            'sw ( id_int_a ) -> $t0',
            'lw ( id_int_a ) -> $t0',
            'sub ( $zero $t0 ) -> $t0',
            'sw ( id_int_r ) -> $t0'
        ],
        'As instruções assembly devem ser as esperadas'
    );

    console.log('Código assembly:\n', gerarAssembly(mips.blocoDados, mips.blocoTexto));
    t.end();
});

tape('Verificar código MIPS de uma multiplicação', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
            b: int;
            r: int;
        inicio
            a = 5;
            b = 2;
            r = b * a;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);
    const instrucoes = gerador.optimizar();
    const mips = new Mips(semantico.tabelaDeSimbolos);
    for (const inst of instrucoes) mips.adicionarInstrucoes(inst);

    t.deepEqual(
        mips.blocoDados.map(d => [d.nome, d.diretiva, d.valor].join(' ')),
        [
            'id_int_a word 0',
            'id_int_b word 0',
            'id_int_r word 0'
        ],
        'O bloco de dados deve ser o esperado'
    );

    t.deepEqual(
        mips.blocoTexto.map(i => i.comoString()),
        [
            'addi ( $zero 5 ) -> $t0',
            'sw ( id_int_a ) -> $t0',
            'addi ( $zero 2 ) -> $t0',
            'sw ( id_int_b ) -> $t0',
            'lw ( id_int_b ) -> $t0',
            'lw ( id_int_a ) -> $t1',
            'mult ( $t1 ) -> $t0',
            'mflo ( ) -> $t0',
            'sw ( id_int_r ) -> $t0'
        ],
        'As instruções assembly devem ser as esperadas'
    );

    console.log('Código assembly:\n', gerarAssembly(mips.blocoDados, mips.blocoTexto));
    t.end();
});

tape('Verificar código MIPS de uma divisão', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
            b: int;
            r: int;
        inicio
            a = 10;
            b = 3;
            r = a / b;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);
    const instrucoes = gerador.optimizar();
    const mips = new Mips(semantico.tabelaDeSimbolos);
    for (const inst of instrucoes) mips.adicionarInstrucoes(inst);

    t.deepEqual(
        mips.blocoDados.map(d => [d.nome, d.diretiva, d.valor].join(' ')),
        [
            'id_int_a word 0',
            'id_int_b word 0',
            'id_int_r word 0'
        ],
        'O bloco de dados deve ser o esperado'
    );

    t.deepEqual(
        mips.blocoTexto.map(i => i.comoString()),
        [
            'addi ( $zero 10 ) -> $t0',
            'sw ( id_int_a ) -> $t0',
            'addi ( $zero 3 ) -> $t0',
            'sw ( id_int_b ) -> $t0',
            'lw ( id_int_a ) -> $t0',
            'lw ( id_int_b ) -> $t1',
            'div ( $t1 ) -> $t0',
            'mflo ( ) -> $t0',
            'sw ( id_int_r ) -> $t0'
        ],
        'As instruções assembly devem ser as esperadas'
    );

    console.log('Código assembly:\n', gerarAssembly(mips.blocoDados, mips.blocoTexto));
    t.end();
});

tape('Verificar código MIPS de divisão (mod)', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
            b: int;
            r: int;
        inicio
            a = 10;
            b = 3;
            r = a % b;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);
    const instrucoes = gerador.optimizar();
    const mips = new Mips(semantico.tabelaDeSimbolos);
    for (const inst of instrucoes) mips.adicionarInstrucoes(inst);

    t.deepEqual(
        mips.blocoDados.map(d => [d.nome, d.diretiva, d.valor].join(' ')),
        [
            'id_int_a word 0',
            'id_int_b word 0',
            'id_int_r word 0'
        ],
        'O bloco de dados deve ser o esperado'
    );

    t.deepEqual(
        mips.blocoTexto.map(i => i.comoString()),
        [
            'addi ( $zero 10 ) -> $t0',
            'sw ( id_int_a ) -> $t0',
            'addi ( $zero 3 ) -> $t0',
            'sw ( id_int_b ) -> $t0',
            'lw ( id_int_a ) -> $t0',
            'lw ( id_int_b ) -> $t1',
            'div ( $t1 ) -> $t0',
            'mfhi ( ) -> $t0',
            'sw ( id_int_r ) -> $t0'
        ],
        'As instruções assembly devem ser as esperadas'
    );

    console.log('Código assembly:\n', gerarAssembly(mips.blocoDados, mips.blocoTexto));
    t.end();
});

tape('Verificar código MIPS com comando retorne simples com valor literal', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        inicio
            retorne 123;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);
    const instrucoes = gerador.optimizar();
    const mips = new Mips(semantico.tabelaDeSimbolos);
    for (const inst of instrucoes) mips.adicionarInstrucoes(inst);

    t.deepEqual(
        mips.blocoDados.map(d => [d.nome, d.diretiva, d.valor].join(' ')),
        [],
        'O bloco de dados deve ser o esperado'
    );

    t.deepEqual(
        mips.blocoTexto.map(i => i.comoString()),
        [
            'addi ( $zero 123 ) -> $t0',
            'addi ( $zero 17 ) -> $v0',
            'add ( $zero $t0 ) -> $a0',
            'syscall ( ) -> ',
        ],
        'As instruções assembly devem ser as esperadas'
    );

    console.log('Código assembly:\n', gerarAssembly(mips.blocoDados, mips.blocoTexto));
    t.end();
});

tape('Verificar código MIPS com comando retorne simples com variável', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
        inicio
            a = 123;
            retorne a;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);
    const instrucoes = gerador.optimizar();
    const mips = new Mips(semantico.tabelaDeSimbolos);
    for (const inst of instrucoes) mips.adicionarInstrucoes(inst);

    t.deepEqual(
        mips.blocoDados.map(d => [d.nome, d.diretiva, d.valor].join(' ')),
        [
            'id_int_a word 0'
        ],
        'O bloco de dados deve ser o esperado'
    );

    t.deepEqual(
        mips.blocoTexto.map(i => i.comoString()),
        [
            'addi ( $zero 123 ) -> $t0',
            'sw ( id_int_a ) -> $t0',
            'lw ( id_int_a ) -> $t0',
            'addi ( $zero 17 ) -> $v0',
            'add ( $zero $t0 ) -> $a0',
            'syscall ( ) -> ',
        ],
        'As instruções assembly devem ser as esperadas'
    );

    console.log('Código assembly:\n', gerarAssembly(mips.blocoDados, mips.blocoTexto));
    t.end();
});

tape('Verificar código MIPS com comando retorne com expressão', (t) => {

    const semantico = new Semantico(sintatico.parsear(`
        variaveis
            a: int;
        inicio
            a = 10;
            retorne (a + 1) % 2;
        fim
    `));

    const comandos = semantico.validarComandos();
    const gerador = new Intermediario(comandos);
    const instrucoes = gerador.optimizar();
    const mips = new Mips(semantico.tabelaDeSimbolos);
    for (const inst of instrucoes) mips.adicionarInstrucoes(inst);

    t.deepEqual(
        mips.blocoDados.map(d => [d.nome, d.diretiva, d.valor].join(' ')),
        [
            'id_int_a word 0'
        ],
        'O bloco de dados deve ser o esperado'
    );

    t.deepEqual(
        mips.blocoTexto.map(i => i.comoString()),
        [
            'addi ( $zero 10 ) -> $t0',
            'sw ( id_int_a ) -> $t0',
            'lw ( id_int_a ) -> $t0',
            'addi ( $zero 1 ) -> $t1',
            'add ( $t0 $t1 ) -> $t0',
            'addi ( $zero 2 ) -> $t1',
            'div ( $t1 ) -> $t0',
            'mfhi ( ) -> $t0',
            'addi ( $zero 17 ) -> $v0',
            'add ( $zero $t0 ) -> $a0',
            'syscall ( ) -> ',
        ],
        'As instruções assembly devem ser as esperadas'
    );

    console.log('Código assembly:\n', gerarAssembly(mips.blocoDados, mips.blocoTexto));
    t.end();
});
