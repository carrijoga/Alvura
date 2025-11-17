// estoque.js - JavaScript para a tela de consulta de estoque

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
            document.getElementById('categoriaFilter').value = '';
            document.getElementById('statusFilter').value = '';
            document.getElementById('fornecedorFilter').value = '';
            document.getElementById('ordenarFilter').value = 'nome-asc';
        });
    }

    // Apply Filters
    const applyFilters = document.getElementById('applyFilters');
    if (applyFilters) {
        applyFilters.addEventListener('click', function() {
            const searchValue = document.getElementById('searchFilter').value;
            const categoriaValue = document.getElementById('categoriaFilter').value;
            const statusValue = document.getElementById('statusFilter').value;
            const fornecedorValue = document.getElementById('fornecedorFilter').value;
            const ordenarValue = document.getElementById('ordenarFilter').value;

            console.log('Aplicando filtros:', {
                search: searchValue,
                categoria: categoriaValue,
                status: statusValue,
                fornecedor: fornecedorValue,
                ordenar: ordenarValue
            });

            // Aqui você implementaria a lógica de filtro real
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

    // Highlight low stock items
    const tableRows = document.querySelectorAll('.orders-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            if (!this.classList.contains('row-delayed')) {
                this.style.backgroundColor = 'var(--bg-secondary)';
            }
        });
        row.addEventListener('mouseleave', function() {
            if (!this.classList.contains('row-delayed')) {
                this.style.backgroundColor = '';
            }
        });
    });

    // Alert for critical stock
    const criticalItems = document.querySelectorAll('.status-badge.status-cancelado');
    if (criticalItems.length > 0) {
        console.log(`Alerta: ${criticalItems.length} produto(s) com estoque crítico!`);
    }
});
