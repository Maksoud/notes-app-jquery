// Notes App: bloco de notas simples feito com jQuery.
// As notas são guardadas no localStorage como uma lista de textos.

const CHAVE_STORAGE = 'notes';

// Notas mostradas na primeira visita (quando ainda não há nada salvo)
const NOTAS_EXEMPLO = [
    'Bem-vindo ao Notes App!\n\nClique no lápis para editar uma nota e no disquete para salvar.',
    'Lista de compras\n- Café\n- Pão\n- Frutas',
    'Atalhos de teclado\nCtrl+Enter ou Esc: terminar a edição\nDuplo clique no texto: editar'
];

$(function () {
    carregarNotas().forEach(function (texto) {
        criarNota(texto, false);
    });
    atualizarVazio();

    $('#add').on('click', function () {
        criarNota('', true);
        atualizarVazio();
    });

    $('#exemplos').on('click', function () {
        NOTAS_EXEMPLO.forEach(function (texto) {
            criarNota(texto, false);
        });
        atualizarVazio();
        $('#add').trigger('focus');
    });
});

// Lê as notas salvas. Na primeira visita usa as notas de exemplo.
// Se o localStorage estiver bloqueado ou com dados inválidos,
// também cai nos exemplos em vez de quebrar a página.
function carregarNotas() {
    try {
        const salvo = localStorage.getItem(CHAVE_STORAGE);
        if (salvo === null) {
            return NOTAS_EXEMPLO;
        }
        const dados = JSON.parse(salvo);
        return Array.isArray(dados) ? dados.filter((t) => typeof t === 'string') : NOTAS_EXEMPLO;
    } catch (erro) {
        return NOTAS_EXEMPLO;
    }
}

// Salva o texto de todas as notas, na ordem em que aparecem na tela.
function salvarNotas() {
    const textos = $('#notas textarea').map(function () {
        return $(this).val();
    }).get();

    try {
        localStorage.setItem(CHAVE_STORAGE, JSON.stringify(textos));
    } catch (erro) {
        mostrarAviso('Não foi possível salvar neste navegador.');
    }
}

// Cria o elemento de uma nota e coloca na tela.
// emEdicao = true abre a nota já com o campo de texto em foco.
function criarNota(texto, emEdicao) {
    const $nota = $('<article>').addClass('nota');

    const $editar = $('<button type="button">').addClass('editar');
    const $remover = $('<button type="button">')
        .addClass('remover')
        .attr({ 'aria-label': 'Remover nota', title: 'Remover nota' })
        .append($('<i>').addClass('fas fa-trash-alt').attr('aria-hidden', 'true'));

    // .text() mostra o conteúdo como texto puro: "<b>x</b>" aparece literalmente
    const $conteudo = $('<div>').addClass('conteudo').text(texto);
    const $campo = $('<textarea>')
        .attr({ 'aria-label': 'Texto da nota', placeholder: 'Escreva sua nota...' })
        .val(texto);

    $nota.append(
        $('<div>').addClass('ferramentas').append($editar, $remover),
        $conteudo,
        $campo
    );

    $editar.on('click', function () {
        alternarEdicao($nota, !$nota.hasClass('editando'));
    });

    // Clicar duas vezes no texto também abre a edição
    $conteudo.on('dblclick', function () {
        alternarEdicao($nota, true);
    });

    // Salva enquanto digita, assim nada se perde ao recarregar
    $campo.on('input', function () {
        $conteudo.text($campo.val());
        salvarNotas();
    });

    // Atalhos: Ctrl+Enter ou Esc terminam a edição
    $campo.on('keydown', function (evento) {
        if (evento.key === 'Escape' || (evento.key === 'Enter' && (evento.ctrlKey || evento.metaKey))) {
            evento.preventDefault();
            alternarEdicao($nota, false);
            $editar.trigger('focus');
        }
    });

    $remover.on('click', function () {
        $nota.remove();
        salvarNotas();
        atualizarVazio();
        mostrarAviso('Nota removida.');
        $('#add').trigger('focus');
    });

    $('#notas').append($nota);
    alternarEdicao($nota, emEdicao);
    salvarNotas();
}

// Liga ou desliga o modo de edição de uma nota.
function alternarEdicao($nota, editando) {
    const $editar = $nota.find('.editar');
    const rotulo = editando ? 'Salvar nota' : 'Editar nota';
    const estavaEditando = $nota.hasClass('editando');

    $nota.toggleClass('editando', editando);
    $editar
        .attr({ 'aria-label': rotulo, title: rotulo })
        .empty()
        .append($('<i>').addClass(editando ? 'fas fa-save' : 'fas fa-edit').attr('aria-hidden', 'true'));

    if (editando) {
        $nota.find('textarea').trigger('focus');
    } else if (estavaEditando) {
        salvarNotas();
        mostrarAviso('Nota salva.');
    }
}

// Mostra a mensagem de lista vazia quando não há notas.
function atualizarVazio() {
    $('#vazio').prop('hidden', $('#notas .nota').length > 0);
}

// Mostra uma mensagem curta no canto da tela por alguns segundos.
let temporizadorAviso = null;
function mostrarAviso(mensagem) {
    const $aviso = $('#aviso');
    $aviso.text(mensagem).addClass('visivel');

    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function () {
        $aviso.removeClass('visivel');
    }, 2000);
}
