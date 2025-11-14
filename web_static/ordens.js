// Ordens.js - Funcionalidades específicas da tela de ordens

// Toggle Filters
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

// Select All Checkboxes
const selectAllCheckbox = document.getElementById('selectAll');
if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.orders-table tbody .checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });
}

// Clear Filters
const clearFiltersBtn = document.getElementById('clearFilters');
if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
        document.getElementById('searchFilter').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('clienteFilter').value = '';
        document.getElementById('dataInicialFilter').value = '';
        document.getElementById('dataFinalFilter').value = '';
        document.getElementById('motoristaFilter').value = '';
        
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
            dataInicial: document.getElementById('dataInicialFilter').value,
            dataFinal: document.getElementById('dataFinalFilter').value,
            motorista: document.getElementById('motoristaFilter').value
        };
        
        console.log('Aplicando filtros:', filters);
        // Aqui você faria a chamada à API com os filtros
        filterOrders(filters);
    });
}

// Filter Orders Function (mock)
function filterOrders(filters) {
    const tbody = document.getElementById('ordersTableBody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        let show = true;
        
        // Filter by search
        if (filters.search) {
            const text = row.textContent.toLowerCase();
            show = show && text.includes(filters.search.toLowerCase());
        }
        
        // Filter by status
        if (filters.status) {
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge) {
                const statusClass = Array.from(statusBadge.classList)
                    .find(c => c.startsWith('status-'));
                show = show && statusClass === `status-${filters.status}`;
            }
        }
        
        row.style.display = show ? '' : 'none';
    });
}

// Real-time search
const searchFilter = document.getElementById('searchFilter');
if (searchFilter) {
    let searchTimeout;
    searchFilter.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filterOrders({ search: e.target.value });
        }, 300);
    });
}

// Pagination
const paginationBtns = document.querySelectorAll('.pagination-btn');
paginationBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (!this.disabled && !this.classList.contains('active')) {
            paginationBtns.forEach(b => b.classList.remove('active'));
            
            if (this.textContent.trim() && !isNaN(this.textContent.trim())) {
                this.classList.add('active');
                console.log('Página selecionada:', this.textContent);
                // Aqui você carregaria os dados da página
            }
        }
    });
});

// Items per page selector
const paginationSelect = document.querySelector('.pagination-select');
if (paginationSelect) {
    paginationSelect.addEventListener('change', (e) => {
        console.log('Itens por página:', e.target.value);
        // Aqui você recarregaria a tabela com o novo limite
    });
}

// Export functions
function exportToExcel() {
    console.log('Exportando para Excel...');
    // Implementar exportação
}

function exportToPDF() {
    console.log('Exportando para PDF...');
    // Implementar exportação
}

function printTable() {
    console.log('Imprimindo tabela...');
    window.print();
}

// Add event listeners to export buttons
document.addEventListener('DOMContentLoaded', () => {
    const exportButtons = document.querySelectorAll('.btn-icon');
    if (exportButtons.length >= 3) {
        exportButtons[0].addEventListener('click', exportToExcel);
        exportButtons[1].addEventListener('click', exportToPDF);
        exportButtons[2].addEventListener('click', printTable);
    }
});

// Confirm delete/cancel
function confirmCancel(osNumber) {
    if (confirm(`Tem certeza que deseja cancelar a ordem ${osNumber}?`)) {
        console.log(`Cancelando ordem ${osNumber}`);
        // Aqui você faria a chamada à API para cancelar
    }
}

// Add click handlers to cancel buttons
document.querySelectorAll('.btn-action-danger').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const row = this.closest('tr');
        const osNumber = row.querySelector('.os-number').textContent;
        confirmCancel(osNumber);
    });
});

// Set today's date as default for date filters
const today = new Date().toISOString().split('T')[0];
const dataInicialFilter = document.getElementById('dataInicialFilter');
const dataFinalFilter = document.getElementById('dataFinalFilter');

if (dataFinalFilter) {
    dataFinalFilter.value = today;
}

// Sort table
function sortTable(columnIndex, order = 'asc') {
    const tbody = document.getElementById('ordersTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        if (order === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

// Add sort functionality to table headers (optional)
document.querySelectorAll('.orders-table th').forEach((th, index) => {
    if (index > 0) { // Skip checkbox column
        th.style.cursor = 'pointer';
        th.addEventListener('click', function() {
            const currentOrder = this.dataset.order || 'asc';
            const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
            this.dataset.order = newOrder;
            
            // Remove sort indicators from all headers
            document.querySelectorAll('.orders-table th').forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });
            
            // Add indicator to current header
            this.classList.add(`sort-${newOrder}`);
            
            sortTable(index, newOrder);
        });
    }
});

// Auto-refresh (simulate real-time updates)
let autoRefreshInterval;

function startAutoRefresh(intervalMinutes = 1) {
    autoRefreshInterval = setInterval(() => {
        console.log('Auto-atualizando lista de ordens...');
        // Aqui você faria a chamada à API para buscar novas ordens
        // refreshOrders();
    }, intervalMinutes * 60 * 1000);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
}

// Start auto-refresh when page loads
// startAutoRefresh(1);

// Stop auto-refresh when page unloads
window.addEventListener('beforeunload', stopAutoRefresh);

console.log('Ordens.js carregado com sucesso!');
