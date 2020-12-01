const padroes = {

    opAritmeticos: ['+', '-', '*', '/', '%'],
    opLogicos: ['==', '!=', '>', '>=', '<', '<=', '&', '|'],
    especiais: ['=', '(', ')', ',', ':', ';'],

    nomeEscalares: ['int', 'bool', 'string'],
    palavras: ['var', 'inicio', 'fim', 'se', 'senao', 'fimse', 'ler', 'escrever'],
    boolLiterais: ['verd', 'fals'],

    stringLiteral: "([\"'])(?:(?=(\\\\?))\\2.)*?\\1",
    intLitaral: /^[1-9][0-9]*|0([1-7][0-7]*|x[0-9a-zA-Z]+)?$/,
    identificadores: /^[a-zA-Z\_][a-zA-Z\_0-9]*$/,

    espacos: /\s+/g,
    EOL: "\n"
};

padroes.matchExact = (str, regex) => {
    const m = str.match(regex);
    return m !== null && str === m[0];
}

padroes.ehEspaco = (s) => padroes.matchExact(s, padroes.espacos);

padroes.ehStringLiteral = (s) => padroes.matchExact(
    s, new RegExp('^'+padroes.stringLiteral+'$')
);

padroes.classesDeToken = {
    'nome-escalar': (s) => padroes.nomeEscalares.includes(s),
    'comando': (s) => padroes.palavras.includes(s),
    'literal-bool': (s) => padroes.boolLiterais.includes(s),
    'op-aritmetico': (s) => padroes.opAritmeticos.includes(s),
    'op-logico': (s) => padroes.opLogicos.includes(s),
    'especial': (s) => padroes.especiais.includes(s),
    'literal-string': (s) => padroes.ehStringLiteral(s),
    'identificador': (s) => padroes.matchExact(s, padroes.identificadores),
    'litaral-int': (s) => padroes.matchExact(s, padroes.intLitaral),
    'sem-categoria': (s) => true
};

padroes.descobrirTokenClasse = (lexema) => {
    return Object.keys(padroes.classesDeToken).find(
        c => padroes.classesDeToken[c](lexema)
    );
}

padroes.subclasseDeToken = {
    'nome-escalar': (s) => padroes.nomeEscalares.find(t => t === s).substr(0, 4),
    'comando': (s) => padroes.palavras.find(t => t === s).substr(0, 4),
    'op-aritmetico': (s) => {
        return {
            '+': 'adi',
            '-': 'sub',
            '*': 'mul',
            '/': 'div',
            '%': 'mod'
        }[s];
    },
    'op-logico': (s) => {
        return {
            '==': 'igu',
            '!=': 'dif',
            '>': 'mai',
            '>=': 'mae',
            '<': 'men',
            '<=': 'mee',
            '&': 'e',
            '|': 'ou'
        }[s];
    },
    'especial': (s) => {
        return {
            '=': 'atr',
            '(': 'apa',
            ')': 'fpa',
            ',': 'vir',
            ':': 'dpo',
            ';': 'del'
        }[s];
    },
    'literal-bool': (s) => '',
    'literal-string': (s) => '',
    'litaral-int': (s) => '',
    'identificador': (s) => '',
    'sem-categoria': (s) => ''
}

padroes.descobrirTokenSubclasse = (lexema, classe) => {
    return padroes.subclasseDeToken[classe](lexema);
}

export default padroes;
