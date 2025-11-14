// detalhes-ordem.js - Funcionalidades da tela de detalhes da ordem

// Modal functionality
const updateStatusBtn = document.getElementById('updateStatusBtn');
const updateStatusModal = document.getElementById('updateStatusModal');
const closeModal = document.getElementById('closeModal');
const cancelStatusUpdate = document.getElementById('cancelStatusUpdate');
const confirmStatusUpdate = document.getElementById('confirmStatusUpdate');

// Open modal
updateStatusBtn.addEventListener('click', () => {
    updateStatusModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

// Close modal
function closeStatusModal() {
    updateStatusModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('newStatus').value = '';
    document.getElementById('statusObservacao').value = '';
}

closeModal.addEventListener('click', closeStatusModal);
cancelStatusUpdate.addEventListener('click', closeStatusModal);

// Close modal on overlay click
updateStatusModal.querySelector('.modal-overlay').addEventListener('click', closeStatusModal);

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && updateStatusModal.style.display === 'flex') {
        closeStatusModal();
    }
});

// Confirm status update
confirmStatusUpdate.addEventListener('click', () => {
    const newStatus = document.getElementById('newStatus').value;
    const observacao = document.getElementById('statusObservacao').value;
    
    if (!newStatus) {
        alert('Por favor, selecione um status.');
        return;
    }
    
    console.log('Atualizando status:', { newStatus, observacao });
    
    // Aqui você faria a chamada à API para atualizar o status
    // updateOrderStatus(orderId, newStatus, observacao);
    
    alert('Status atualizado com sucesso!');
    closeStatusModal();
    
    // Reload page to show updated status
    // location.reload();
});

// Status name mapping
const statusNames = {
    'solicitado': 'Solicitado',
    'coletado': 'Coletado',
    'lavagem': 'Em Lavagem',
    'secagem': 'Secagem',
    'passadoria': 'Passadoria',
    'embalado': 'Embalado',
    'pronto': 'Pronto para Entrega',
    'rota': 'Em Rota de Entrega',
    'entregue': 'Entregue',
    'cancelado': 'Cancelado'
};

// Quick actions
const quickActionButtons = document.querySelectorAll('.btn-secondary[style*="width: 100%"]');

quickActionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        
        if (icon.classList.contains('fa-sync')) {
            updateStatusBtn.click();
        } else if (icon.classList.contains('fa-phone')) {
            console.log('Iniciando ligação...');
            window.open('tel:+551698765432');
        } else if (icon.classList.contains('fa-envelope')) {
            console.log('Abrindo email...');
            window.open('mailto:contato@vistalindalinda.com.br?subject=OS-2024-0248');
        } else if (icon.classList.contains('fa-whatsapp')) {
            console.log('Abrindo WhatsApp...');
            window.open('https://wa.me/551698765432?text=Olá! Referente à OS-2024-0248...');
        } else if (icon.classList.contains('fa-file-invoice')) {
            console.log('Gerando fatura...');
            alert('Funcionalidade em desenvolvimento: Gerar Fatura');
        } else if (icon.classList.contains('fa-times-circle')) {
            if (confirm('Tem certeza que deseja cancelar esta ordem?\n\nEsta ação não pode ser desfeita.')) {
                console.log('Cancelando ordem...');
                // Aqui você faria a chamada à API para cancelar a ordem
                alert('Ordem cancelada com sucesso!');
            }
        }
    });
});

// Print functionality
document.querySelector('.btn-secondary [class*="fa-print"]').parentElement.addEventListener('click', () => {
    window.print();
});

// Edit button
document.querySelector('.btn-secondary [class*="fa-edit"]').parentElement.addEventListener('click', () => {
    console.log('Editando ordem...');
    // window.location.href = 'editar-ordem.html?id=OS-2024-0248';
    alert('Funcionalidade em desenvolvimento: Editar Ordem');
});

// Format timeline dates
function formatTimelineDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('pt-BR', options);
}

// Animate timeline items on page load
document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 50);
        }, index * 150);
    });
});

// Calculate time elapsed since creation
function calculateTimeElapsed(createdDate) {
    const now = new Date();
    const created = new Date(createdDate);
    const diffMs = now - created;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
        return `há ${diffHours}h ${diffMinutes}min`;
    } else {
        return `há ${diffMinutes} minutos`;
    }
}

// Update time elapsed display (if exists)
const createdDateElement = document.querySelector('[style*="color: var(--text-secondary)"]');
if (createdDateElement) {
    const originalText = createdDateElement.textContent;
    // You could update this periodically if needed
}

// Auto-save functionality for notes/observations
let autoSaveTimeout;
const observacoesTextarea = document.querySelector('.table-card p[style*="color: var(--text-secondary)"]');

if (observacoesTextarea) {
    // Convert to editable if admin
    // This would be conditional based on user permissions
    observacoesTextarea.setAttribute('contenteditable', 'false');
}

console.log('Detalhes da Ordem.js carregado com sucesso!');
