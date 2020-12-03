export default function ErroLexico (encontrado) {
    const exc = new Error (
        'Lexema "' + encontrado.palavra + '" não reconhecida'
    );
    exc.detalhes = { encontrado: encontrado };
    return exc;
}
