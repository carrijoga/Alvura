// financeiro.js - Funcionalidades do módulo financeiro

// Tabs functionality
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const tab = this.dataset.tab;
        console.log('Tab selecionada:', tab);
        
        // Aqui você filtraria a tabela baseado na tab
        filterByTab(tab);
    });
});

function filterByTab(tab) {
    // Implementar filtro por tab
    console.log('Filtrando por tab:', tab);
}

// Toggle Filters (reuse from ordens.js)
const toggleFiltersBtn = document.getElementById('toggleFilters');
const filtersContent = document.getElementById('filtersContent');

if (toggleFiltersBtn && filtersContent) {
    toggleFiltersBtn.addEventListener('click', () => {
        filtersContent.classList.toggle('collapsed');
        const icon = toggleFiltersBtn.querySelector('i');
        
        if (filtersContent.classList.contains('collapsed')) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
            toggleFiltersBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Expandir';
        } else {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
            toggleFiltersBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Recolher';
        }
    });
}

// Clear Filters
const clearFiltersBtn = document.getElementById('clearFilters');
if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
        document.getElementById('searchFilter').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('clienteFilter').value = '';
        document.getElementById('periodoFilter').value = '';
        document.getElementById('tipoFilter').value = '';
        document.getElementById('valorMinFilter').value = '';
        
        console.log('Filtros limpos');
    });
}

// Apply Filters
const applyFiltersBtn = document.getElementById('applyFilters');
if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
        const filters = {
            search: document.getElementById('searchFilter').value,
            status: document.getElementById('statusFilter').value,
            cliente: document.getElementById('clienteFilter').value,
            periodo: document.getElementById('periodoFilter').value,
            tipo: document.getElementById('tipoFilter').value,
            valorMin: document.getElementById('valorMinFilter').value
        };
        
        console.log('Aplicando filtros:', filters);
        // Implementar lógica de filtro
    });
}

// Agrupar Financeiros Modal
const agruparBtn = document.getElementById('agruparFinanceirosBtn');
const agruparModal = document.getElementById('agruparModal');
const closeAgruparModal = document.getElementById('closeAgruparModal');
const cancelAgrupar = document.getElementById('cancelAgrupar');
const confirmAgrupar = document.getElementById('confirmAgrupar');

let selectedFinanceiros = [];

// Open modal
agruparBtn.addEventListener('click', () => {
    // Verificar se há checkboxes marcados
    const checkboxes = document.querySelectorAll('.financeiro-checkbox:checked');
    
    if (checkboxes.length === 0) {
        alert('Por favor, selecione pelo menos 2 financeiros para agrupar.');
        return;
    }
    
    if (checkboxes.length < 2) {
        alert('Selecione pelo menos 2 financeiros para criar um agrupamento.');
        return;
    }
    
    // Verificar se são do mesmo cliente
    const clientes = new Set();
    checkboxes.forEach(cb => {
        clientes.add(cb.dataset.cliente);
    });
    
    if (clientes.size > 1) {
        alert('Os financeiros selecionados devem ser do mesmo cliente.');
        return;
    }
    
    // Verificar se são apenas pendentes
    const hasPaid = Array.from(checkboxes).some(cb => cb.dataset.status !== 'pendente');
    if (hasPaid) {
        alert('Só é possível agrupar financeiros com status "Pendente".');
        return;
    }
    
    // Coletar dados dos financeiros selecionados
    selectedFinanceiros = [];
    checkboxes.forEach(cb => {
        const row = cb.closest('tr');
        const numero = row.querySelector('.financeiro-number').textContent;
        const valorText = row.querySelector('.valor-destaque').textContent;
        const valor = parseFloat(valorText.replace('R$', '').replace('.', '').replace(',', '.').trim());
        const osInfo = row.querySelector('small')?.textContent || 'Avulso';
        
        selectedFinanceiros.push({
            id: cb.dataset.id,
            numero: numero,
            valor: valor,
            os: osInfo
        });
    });
    
    renderSelectedFinanceiros();
    agruparModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

// Render selected financeiros in modal
function renderSelectedFinanceiros() {
    const container = document.getElementById('selectedFinanceiros');
    
    if (selectedFinanceiros.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>Nenhum financeiro selecionado</h3>
                <p>Selecione financeiros na tabela para agrupá-los.</p>
            </div>
        `;
        return;
    }
    
    const total = selectedFinanceiros.reduce((sum, f) => sum + f.valor, 0);
    
    container.innerHTML = `
        <div class="selected-list">
            ${selectedFinanceiros.map(f => `
                <div class="selected-item">
                    <div class="selected-item-info">
                        <div class="selected-item-number">${f.numero}</div>
                        <div class="selected-item-detail">${f.os}</div>
                    </div>
                    <div class="selected-item-valor">${formatCurrency(f.valor)}</div>
                </div>
            `).join('')}
        </div>
        <div class="selected-total">
            <span class="selected-total-label">Total do Agrupamento:</span>
            <span class="selected-total-value">${formatCurrency(total)}</span>
        </div>
    `;
}

// Close modal
function closeAgruparModalFunc() {
    agruparModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset
    document.getElementById('vencimentoGrupo').value = '';
    document.getElementById('observacoesGrupo').value = '';
}

closeAgruparModal.addEventListener('click', closeAgruparModalFunc);
cancelAgrupar.addEventListener('click', closeAgruparModalFunc);

agruparModal.querySelector('.modal-overlay').addEventListener('click', closeAgruparModalFunc);

// Confirm agrupamento
confirmAgrupar.addEventListener('click', () => {
    const vencimento = document.getElementById('vencimentoGrupo').value;
    const observacoes = document.getElementById('observacoesGrupo').value;
    
    if (!vencimento) {
        alert('Por favor, informe a data de vencimento do grupo.');
        return;
    }
    
    const total = selectedFinanceiros.reduce((sum, f) => sum + f.valor, 0);
    
    const agrupamentoData = {
        financeiros: selectedFinanceiros.map(f => f.id),
        vencimento: vencimento,
        observacoes: observacoes,
        total: total
    };
    
    console.log('Criando agrupamento:', agrupamentoData);
    
    // Aqui você faria a chamada à API para criar o agrupamento
    // criarAgrupamento(agrupamentoData);
    
    alert(`Agrupamento criado com sucesso!\n\nTotal: ${formatCurrency(total)}\nFinanceiros: ${selectedFinanceiros.length}\n\nBoleto será gerado automaticamente.`);
    
    closeAgruparModalFunc();
    
    // Desmarcar checkboxes
    document.querySelectorAll('.financeiro-checkbox:checked').forEach(cb => {
        cb.checked = false;
    });
    
    // Recarregar tabela
    // location.reload();
});

// Select All Checkbox
const selectAllCheckbox = document.getElementById('selectAll');
if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.financeiro-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });
}

// Format Currency
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Set default date for vencimento (30 days from now)
const vencimentoGrupo = document.getElementById('vencimentoGrupo');
if (vencimentoGrupo) {
    const today = new Date();
    const futureDate = new Date(today.setDate(today.getDate() + 30));
    const formattedDate = futureDate.toISOString().split('T')[0];
    vencimentoGrupo.min = new Date().toISOString().split('T')[0];
}

// Search functionality
const searchFilter = document.getElementById('searchFilter');
if (searchFilter) {
    let searchTimeout;
    searchFilter.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#financeirosTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }, 300);
    });
}

// Ações rápidas nos botões da tabela
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-action');
    if (!btn) return;
    
    const icon = btn.querySelector('i');
    const row = btn.closest('tr');
    const finNumber = row.querySelector('.financeiro-number')?.textContent;
    
    if (icon.classList.contains('fa-barcode')) {
        console.log('Gerando boleto para:', finNumber);
        alert(`Boleto gerado com sucesso para ${finNumber}!\n\nO código de barras foi copiado para a área de transferência.`);
    } else if (icon.classList.contains('fa-check')) {
        console.log('Registrando pagamento para:', finNumber);
        const valor = row.querySelector('.valor-destaque')?.textContent;
        if (confirm(`Confirmar pagamento de ${valor} para ${finNumber}?`)) {
            alert('Pagamento registrado com sucesso!');
            // Atualizar status na tabela
        }
    } else if (icon.classList.contains('fa-paper-plane')) {
        console.log('Enviando cobrança para:', finNumber);
        alert(`Cobrança enviada por e-mail e WhatsApp para ${finNumber}!`);
    } else if (icon.classList.contains('fa-download')) {
        console.log('Baixando comprovante de:', finNumber);
        alert(`Download do comprovante iniciado para ${finNumber}!`);
    }
});

// Pagination
const paginationBtns = document.querySelectorAll('.pagination-btn');
paginationBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (!this.disabled && !this.classList.contains('active')) {
            paginationBtns.forEach(b => b.classList.remove('active'));
            
            if (this.textContent.trim() && !isNaN(this.textContent.trim())) {
                this.classList.add('active');
                console.log('Página selecionada:', this.textContent);
            }
        }
    });
});

console.log('Financeiro.js carregado com sucesso!');
