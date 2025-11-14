// criar-financeiro.js

// Mock data - Cliente info
const clientesData = {
    '1': {
        nome: 'Hotel Fazenda Vista Linda',
        contato: 'Maria Silva',
        telefone: '(16) 98765-4321',
        email: 'contato@vistalindalinda.com.br'
    },
    '2': {
        nome: 'Pousada Jardim Real',
        contato: 'João Santos',
        telefone: '(16) 99876-5432',
        email: 'reservas@jardimreal.com.br'
    },
    '3': {
        nome: 'Resort Praias Douradas',
        contato: 'Ana Costa',
        telefone: '(16) 97654-3210',
        email: 'contato@praiasdouradas.com.br'
    },
    '4': {
        nome: 'Hotel Central Plaza',
        contato: 'Pedro Oliveira',
        telefone: '(16) 96543-2109',
        email: 'reservas@centralplaza.com.br'
    },
    '5': {
        nome: 'Pousada Serra Verde',
        contato: 'Carla Mendes',
        telefone: '(16) 95432-1098',
        email: 'contato@serraverde.com.br'
    }
};

// Initialize dates
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dataEmissao').value = today;
    
    // Set vencimento 30 days from now
    const vencimento = new Date();
    vencimento.setDate(vencimento.getDate() + 30);
    document.getElementById('dataVencimento').value = vencimento.toISOString().split('T')[0];
    document.getElementById('dataVencimento').min = today;
});

// Cliente Select Change
const clienteSelect = document.getElementById('clienteSelect');
clienteSelect.addEventListener('change', (e) => {
    const clienteId = e.target.value;
    
    if (clienteId && clientesData[clienteId]) {
        const cliente = clientesData[clienteId];
        document.getElementById('contatoInput').value = cliente.contato;
        document.getElementById('telefoneInput').value = cliente.telefone;
        document.getElementById('emailInput').value = cliente.email;
    } else {
        document.getElementById('contatoInput').value = '';
        document.getElementById('telefoneInput').value = '';
        document.getElementById('emailInput').value = '';
    }
    
    updatePreview();
});

// Valor Input - Format currency
const valorInput = document.getElementById('valorInput');
valorInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2);
    e.target.value = formatCurrency(parseFloat(value));
    updatePreview();
});

valorInput.addEventListener('blur', (e) => {
    if (!e.target.value || e.target.value === 'R$ 0,00') {
        e.target.value = '';
    }
});

// Format Currency
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Parse currency to number
function parseCurrency(value) {
    return parseFloat(value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
}

// Preview Button
const previewBtn = document.getElementById('previewBtn');
const previewCard = document.getElementById('previewCard');

previewBtn.addEventListener('click', () => {
    const clienteId = document.getElementById('clienteSelect').value;
    
    if (!clienteId) {
        alert('Por favor, selecione um cliente primeiro.');
        return;
    }
    
    updatePreview();
    previewCard.style.display = 'block';
    previewCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Update Preview
function updatePreview() {
    const clienteId = document.getElementById('clienteSelect').value;
    const descricao = document.getElementById('descricaoInput').value;
    const valor = document.getElementById('valorInput').value;
    const vencimento = document.getElementById('dataVencimento').value;
    
    if (clienteId && clientesData[clienteId]) {
        document.getElementById('previewCliente').textContent = clientesData[clienteId].nome;
    }
    
    document.getElementById('previewDescricao').textContent = descricao || 'Nenhuma descrição';
    document.getElementById('previewValor').textContent = valor || 'R$ 0,00';
    
    if (vencimento) {
        const dataFormatted = new Date(vencimento).toLocaleDateString('pt-BR');
        document.getElementById('previewVencimento').textContent = `Vencimento: ${dataFormatted}`;
    }
}

// Form Submit
const createFinanceiroForm = document.getElementById('createFinanceiroForm');
createFinanceiroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validações
    const clienteId = document.getElementById('clienteSelect').value;
    const descricao = document.getElementById('descricaoInput').value;
    const categoria = document.getElementById('categoriaSelect').value;
    const valor = document.getElementById('valorInput').value;
    const dataEmissao = document.getElementById('dataEmissao').value;
    const dataVencimento = document.getElementById('dataVencimento').value;
    
    if (!clienteId) {
        alert('Por favor, selecione um cliente.');
        return;
    }
    
    if (!descricao) {
        alert('Por favor, informe uma descrição.');
        return;
    }
    
    if (!categoria) {
        alert('Por favor, selecione uma categoria.');
        return;
    }
    
    if (!valor || parseCurrency(valor) <= 0) {
        alert('Por favor, informe um valor válido.');
        return;
    }
    
    if (!dataEmissao || !dataVencimento) {
        alert('Por favor, preencha as datas de emissão e vencimento.');
        return;
    }
    
    // Verificar se vencimento é depois da emissão
    if (new Date(dataVencimento) < new Date(dataEmissao)) {
        alert('A data de vencimento deve ser posterior à data de emissão.');
        return;
    }
    
    // Coletar dados
    const financeiroData = {
        tipo: 'avulso',
        clienteId: clienteId,
        descricao: descricao,
        categoria: categoria,
        valor: parseCurrency(valor),
        dataEmissao: dataEmissao,
        dataVencimento: dataVencimento,
        formaPagamento: document.getElementById('formaPagamentoSelect').value || null,
        observacoes: document.getElementById('observacoes').value,
        opcoes: {
            gerarBoleto: document.getElementById('gerarBoletoCheck').checked,
            enviarEmail: document.getElementById('enviarEmailCheck').checked,
            enviarWhatsapp: document.getElementById('enviarWhatsappCheck').checked
        }
    };
    
    console.log('Criando financeiro avulso:', financeiroData);
    
    // Aqui você faria a chamada à API
    // criarFinanceiroAvulso(financeiroData);
    
    let mensagem = `Financeiro avulso criado com sucesso!\n\nCliente: ${clientesData[clienteId].nome}\nDescrição: ${descricao}\nValor: ${valor}\nVencimento: ${new Date(dataVencimento).toLocaleDateString('pt-BR')}`;
    
    if (financeiroData.opcoes.gerarBoleto) {
        mensagem += '\n\n✅ Boleto gerado automaticamente';
    }
    if (financeiroData.opcoes.enviarEmail) {
        mensagem += '\n✅ Email enviado para o cliente';
    }
    if (financeiroData.opcoes.enviarWhatsapp) {
        mensagem += '\n✅ WhatsApp enviado para o cliente';
    }
    
    alert(mensagem);
    
    // Redirecionar para a lista
    if (confirm('Deseja criar outro financeiro?')) {
        // Reset form
        createFinanceiroForm.reset();
        document.getElementById('contatoInput').value = '';
        document.getElementById('telefoneInput').value = '';
        document.getElementById('emailInput').value = '';
        previewCard.style.display = 'none';
        
        // Reset dates
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dataEmissao').value = today;
        const vencimento = new Date();
        vencimento.setDate(vencimento.getDate() + 30);
        document.getElementById('dataVencimento').value = vencimento.toISOString().split('T')[0];
    } else {
        window.location.href = 'financeiro.html';
    }
});

// Auto-update preview on field changes
document.getElementById('descricaoInput').addEventListener('input', updatePreview);
document.getElementById('dataVencimento').addEventListener('change', updatePreview);

// Categoria change - sugerir prazo baseado na categoria
document.getElementById('categoriaSelect').addEventListener('change', (e) => {
    const categoria = e.target.value;
    const dataEmissao = new Date(document.getElementById('dataEmissao').value);
    
    let diasVencimento = 30; // padrão
    
    switch (categoria) {
        case 'servico_extra':
            diasVencimento = 15; // serviço extra: 15 dias
            break;
        case 'multa':
        case 'juros':
            diasVencimento = 7; // multas e juros: 7 dias
            break;
        case 'taxa':
            diasVencimento = 30;
            break;
        default:
            diasVencimento = 30;
    }
    
    const vencimento = new Date(dataEmissao);
    vencimento.setDate(vencimento.getDate() + diasVencimento);
    document.getElementById('dataVencimento').value = vencimento.toISOString().split('T')[0];
    
    updatePreview();
});

console.log('Criar Financeiro.js carregado com sucesso!');
