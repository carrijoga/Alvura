// clientes.js - JavaScript para a tela de consulta de clientes

document.addEventListener('DOMContentLoaded', function() {
    // Toggle Filters
    const toggleFilters = document.getElementById('toggleFilters');
    const filtersContent = document.getElementById('filtersContent');

    if (toggleFilters && filtersContent) {
        toggleFilters.addEventListener('click', function() {
            filtersContent.classList.toggle('collapsed');
            const icon = this.querySelector('i');
            if (filtersContent.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-down';
                this.innerHTML = '<i class="fas fa-chevron-down"></i> Expandir';
            } else {
                icon.className = 'fas fa-chevron-up';
                this.innerHTML = '<i class="fas fa-chevron-up"></i> Recolher';
            }
        });
    }

    // Select All Checkbox
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.orders-table tbody .checkbox');

    if (selectAll) {
        selectAll.addEventListener('change', function() {
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // Individual checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            const someChecked = Array.from(checkboxes).some(cb => cb.checked);

            if (selectAll) {
                selectAll.checked = allChecked;
                selectAll.indeterminate = someChecked && !allChecked;
            }
        });
    });

    // Clear Filters
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            document.getElementById('searchFilter').value = '';
            document.getElementById('statusFilter').value = '';
            document.getElementById('tipoFilter').value = '';
            document.getElementById('cidadeFilter').value = '';
            document.getElementById('ordenarFilter').value = 'nome-asc';
        });
    }

    // Apply Filters
    const applyFilters = document.getElementById('applyFilters');
    if (applyFilters) {
        applyFilters.addEventListener('click', function() {
            const searchValue = document.getElementById('searchFilter').value;
            const statusValue = document.getElementById('statusFilter').value;
            const tipoValue = document.getElementById('tipoFilter').value;
            const cidadeValue = document.getElementById('cidadeFilter').value;
            const ordenarValue = document.getElementById('ordenarFilter').value;

            console.log('Aplicando filtros:', {
                search: searchValue,
                status: statusValue,
                tipo: tipoValue,
                cidade: cidadeValue,
                ordenar: ordenarValue
            });

            // Aqui você implementaria a lógica de filtro real
            // Por exemplo, fazer uma chamada AJAX para buscar os dados filtrados
            alert('Filtros aplicados! (Em produção, isso faria uma busca no servidor)');
        });
    }

    // Search on Enter
    const searchFilter = document.getElementById('searchFilter');
    if (searchFilter) {
        searchFilter.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters.click();
            }
        });
    }

    // Pagination
    const paginationSelect = document.querySelector('.pagination-select');
    if (paginationSelect) {
        paginationSelect.addEventListener('change', function() {
            console.log('Itens por página alterado para:', this.value);
            // Implementar lógica de paginação
        });
    }

    // Action buttons tooltips
    const actionButtons = document.querySelectorAll('.btn-action');
    actionButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            // Você pode adicionar tooltips customizados aqui
        });
    });

    // Export buttons
    const exportExcelBtn = document.querySelector('.btn-icon[title="Exportar para Excel"]');
    const exportPdfBtn = document.querySelector('.btn-icon[title="Exportar para PDF"]');
    const printBtn = document.querySelector('.btn-icon[title="Imprimir"]');

    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', function() {
            console.log('Exportando para Excel...');
            alert('Funcionalidade de exportação para Excel será implementada.');
        });
    }

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function() {
            console.log('Exportando para PDF...');
            alert('Funcionalidade de exportação para PDF será implementada.');
        });
    }

    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }

    // Table row hover effect (optional enhancement)
    const tableRows = document.querySelectorAll('.orders-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--bg-secondary)';
        });
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
});
