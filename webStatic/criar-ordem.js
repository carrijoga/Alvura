// criar-ordem.js - Funcionalidades da tela de criar ordem

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

// Items array
let orderItems = [];
let itemIdCounter = 1;

// Initialize datetime fields with current date/time
document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    
    document.getElementById('dataSolicitacao').value = localDateTime;
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
});

// Add Item Button
const addItemBtn = document.getElementById('addItemBtn');
const addItemForm = document.getElementById('addItemForm');
const cancelAddItem = document.getElementById('cancelAddItem');

addItemBtn.addEventListener('click', () => {
    addItemForm.style.display = 'block';
    addItemBtn.style.display = 'none';
    
    // Reset form
    document.getElementById('itemSelect').value = '';
    document.getElementById('quantidadeInput').value = 1;
    document.getElementById('precoUnitario').value = '';
    document.getElementById('subtotalItem').value = '';
    document.getElementById('observacaoItem').value = '';
});

cancelAddItem.addEventListener('click', () => {
    addItemForm.style.display = 'none';
    addItemBtn.style.display = 'flex';
});

// Item Select Change - Update price
const itemSelect = document.getElementById('itemSelect');
const quantidadeInput = document.getElementById('quantidadeInput');

function updateItemPrice() {
    const selectedOption = itemSelect.options[itemSelect.selectedIndex];
    const price = parseFloat(selectedOption.dataset.price) || 0;
    const quantidade = parseInt(quantidadeInput.value) || 0;
    const subtotal = price * quantidade;
    
    document.getElementById('precoUnitario').value = formatCurrency(price);
    document.getElementById('subtotalItem').value = formatCurrency(subtotal);
}

itemSelect.addEventListener('change', updateItemPrice);
quantidadeInput.addEventListener('input', updateItemPrice);

// Confirm Add Item
const confirmAddItem = document.getElementById('confirmAddItem');
confirmAddItem.addEventListener('click', () => {
    const itemSelectEl = document.getElementById('itemSelect');
    const selectedOption = itemSelectEl.options[itemSelectEl.selectedIndex];
    
    if (!itemSelectEl.value) {
        alert('Por favor, selecione um item.');
        return;
    }
    
    const quantidade = parseInt(document.getElementById('quantidadeInput').value);
    if (quantidade < 1) {
        alert('A quantidade deve ser maior que zero.');
        return;
    }
    
    const item = {
        id: itemIdCounter++,
        itemId: itemSelectEl.value,
        nome: selectedOption.text,
        quantidade: quantidade,
        precoUnitario: parseFloat(selectedOption.dataset.price),
        subtotal: parseFloat(selectedOption.dataset.price) * quantidade,
        observacao: document.getElementById('observacaoItem').value
    };
    
    orderItems.push(item);
    renderItemsTable();
    
    // Hide form and show button again
    addItemForm.style.display = 'none';
    addItemBtn.style.display = 'flex';
});

// Render Items Table
function renderItemsTable() {
    const tbody = document.getElementById('itemsTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (orderItems.length === 0) {
        emptyState.style.display = '';
        updateTotal();
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Clear existing rows (except empty state)
    const existingRows = tbody.querySelectorAll('tr:not(#emptyState)');
    existingRows.forEach(row => row.remove());
    
    // Add item rows
    orderItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.nome}</strong></td>
            <td>${item.quantidade}</td>
            <td>${formatCurrency(item.precoUnitario)}</td>
            <td><strong>${formatCurrency(item.subtotal)}</strong></td>
            <td>${item.observacao || '-'}</td>
            <td>
                <button type="button" class="btn-remove-item" onclick="removeItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.insertBefore(row, emptyState);
    });
    
    updateTotal();
}

// Remove Item
function removeItem(itemId) {
    if (confirm('Tem certeza que deseja remover este item?')) {
        orderItems = orderItems.filter(item => item.id !== itemId);
        renderItemsTable();
    }
}

// Update Total
function updateTotal() {
    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    document.getElementById('totalValue').textContent = formatCurrency(total);
}

// Format Currency
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Form Submit
const createOrderForm = document.getElementById('createOrderForm');
createOrderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate
    const clienteId = document.getElementById('clienteSelect').value;
    if (!clienteId) {
        alert('Por favor, selecione um cliente.');
        return;
    }
    
    if (orderItems.length === 0) {
        alert('Por favor, adicione pelo menos um item à ordem.');
        return;
    }
    
    // Collect form data
    const orderData = {
        clienteId: clienteId,
        dataSolicitacao: document.getElementById('dataSolicitacao').value,
        dataColeta: document.getElementById('dataColeta').value,
        previsaoEntrega: document.getElementById('previsaoEntrega').value,
        motoristaColetaId: document.getElementById('motoristaColeta').value || null,
        observacoes: document.getElementById('observacoes').value,
        itens: orderItems,
        valorTotal: orderItems.reduce((sum, item) => sum + item.subtotal, 0)
    };
    
    console.log('Dados da Ordem:', orderData);
    
    // Show success message
    if (confirm('Ordem de serviço criada com sucesso!\n\nDeseja criar outra ordem?')) {
        // Reset form
        createOrderForm.reset();
        orderItems = [];
        renderItemsTable();
        
        // Reset cliente info
        document.getElementById('contatoInput').value = '';
        document.getElementById('telefoneInput').value = '';
        document.getElementById('emailInput').value = '';
        
        // Reset datetime
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        document.getElementById('dataSolicitacao').value = localDateTime;
    } else {
        window.location.href = 'ordens.html';
    }
});

// Auto-calculate preview delivery date (2 days from collection)
document.getElementById('dataColeta').addEventListener('change', (e) => {
    const coletaDate = new Date(e.target.value);
    if (!isNaN(coletaDate)) {
        const entregaDate = new Date(coletaDate);
        entregaDate.setDate(entregaDate.getDate() + 2);
        
        const localDateTime = new Date(entregaDate.getTime() - entregaDate.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        
        document.getElementById('previsaoEntrega').value = localDateTime;
    }
});

console.log('Criar Ordem.js carregado com sucesso!');
