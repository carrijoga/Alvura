// relatorios.js - JavaScript para a tela de relatórios

document.addEventListener('DOMContentLoaded', function() {
    // Quick report cards hover effect
    const reportCards = document.querySelectorAll('.table-card[style*="cursor: pointer"]');

    reportCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
        });
    });

    // Download button handlers
    const downloadButtons = document.querySelectorAll('.btn-action[title="Download"]');
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Downloading report...');
            alert('Download iniciado!\n\nEm produção, isso baixaria o arquivo do relatório.');
        });
    });

    // Share button handlers
    const shareButtons = document.querySelectorAll('.btn-action[title="Compartilhar"]');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Sharing report...');

            // Show share modal (simplified version)
            const email = prompt('Digite o email do destinatário:');
            if (email) {
                alert(`Relatório será enviado para: ${email}\n\nEm produção, isso enviaria o relatório por email.`);
            }
        });
    });

    // Refresh button
    const refreshBtn = document.querySelector('.btn-icon[title="Atualizar"]');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('Refreshing reports list...');

            // Add spin animation
            const icon = this.querySelector('i');
            icon.classList.add('fa-spin');

            setTimeout(() => {
                icon.classList.remove('fa-spin');
                alert('Lista de relatórios atualizada!');
            }, 1000);
        });
    }

    // Auto-refresh for processing reports
    const processingReports = document.querySelectorAll('.status-badge.status-lavagem');
    if (processingReports.length > 0) {
        console.log(`${processingReports.length} relatório(s) em processamento`);

        // Simulate auto-refresh every 30 seconds
        // Uncomment in production
        /*
        setInterval(() => {
            console.log('Checking for report updates...');
            // Make AJAX call to check status
        }, 30000);
        */
    }

    // Track report views
    const viewButtons = document.querySelectorAll('.btn-action[title="Visualizar"]');
    viewButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            console.log(`Visualizando relatório #${index + 1}`);
        });
    });
});
