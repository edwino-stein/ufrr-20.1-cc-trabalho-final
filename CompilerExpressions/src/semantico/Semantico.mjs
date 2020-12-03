import SimboloIdentificador from './SimboloIdentificador.mjs';
import ErroSemantico from '../exception/ErroSemantico.mjs';

export default class Semantico {

    constructor(arvore) {
        this._arvore = arvore;
        this._tabelaDeSimbolos = [];
    }

    get tabelaDeSimbolos() { return [ ...this._tabelaDeSimbolos ]; }

    _buscarSimbolo(nome) {
        return this._tabelaDeSimbolos.find(s => s.nome === nome);
    }

    _existeSimbolo(nome) {
        return this._buscarSimbolo(nome) !== undefined;
    }

    validarDeclaracoes () {

        const bloco = this._arvore.encontrarTodosNosPreOrdem('<bloco_declaracao>', 1);
        if(bloco.length === 0) return;

        const declaracoes = bloco[0].encontrarTodosNosPreOrdem('<declaracao>');
        for (const dec of declaracoes) {

            const id = dec.encontrarTodosNosPreOrdem('identificador', 1)[0];
            const tipo = dec.encontrarTodosNosPreOrdem('<declaracao_tipo>')[0].nos[0];

            if(this._existeSimbolo(id.extra.palavra)) {
                throw ErroSemantico(id.extra, 'redeclaracao');
            }

            this._tabelaDeSimbolos.push (
                new SimboloIdentificador (
                    id.extra.palavra,
                    tipo.extra.palavra,
                    id.extra.token
                )
            );
        }
    }
}
