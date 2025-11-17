// Header Components - Notificações e Menu de Usuário

document.addEventListener('DOMContentLoaded', function() {
    // Notification Dropdown Toggle
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    // Toggle Notification Dropdown
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.classList.toggle('active');

            // Close user dropdown if open
            if (userDropdown) {
                userDropdown.classList.remove('active');
            }
        });
    }

    // Toggle User Dropdown
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');

            // Close notification dropdown if open
            if (notificationDropdown) {
                notificationDropdown.classList.remove('active');
            }
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (notificationDropdown && !notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.remove('active');
        }

        if (userDropdown && !userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });

    // Notification Tabs
    const notificationTabs = document.querySelectorAll('.notification-tab');
    notificationTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            notificationTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            filterNotifications(filter);
        });
    });

    // Filter notifications
    function filterNotifications(filter) {
        const notifications = document.querySelectorAll('.notification-item');
        const emptyState = document.querySelector('.notifications-empty-state');
        let visibleCount = 0;

        notifications.forEach(notification => {
            const type = notification.getAttribute('data-type');

            if (filter === 'all' || filter === type) {
                notification.style.display = 'flex';
                visibleCount++;
            } else {
                notification.style.display = 'none';
            }
        });

        // Show/hide empty state
        if (emptyState) {
            if (visibleCount === 0) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
            }
        }
    }

    // Mark notification as read
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.remove('unread');
            updateNotificationBadge();
        });
    });

    // Mark all as read
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            notificationItems.forEach(item => {
                item.classList.remove('unread');
            });
            updateNotificationBadge();
        });
    }

    // Update notification badge
    function updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-btn .badge');

        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    // User dropdown items
    const userDropdownItems = document.querySelectorAll('.user-dropdown .dropdown-item');
    userDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const action = this.getAttribute('data-action');

            switch(action) {
                case 'profile':
                    console.log('Navegando para perfil...');
                    window.location.href = 'configuracoes.html';
                    break;
                case 'settings':
                    console.log('Navegando para configurações...');
                    window.location.href = 'configuracoes.html';
                    break;
                case 'help':
                    console.log('Abrindo central de ajuda...');
                    alert('Central de Ajuda\n\nEm produção, isso abriria a documentação do sistema.');
                    break;
                case 'logout':
                    e.preventDefault();
                    if (confirm('Deseja realmente sair do sistema?')) {
                        console.log('Fazendo logout...');
                        alert('Logout realizado com sucesso!\n\nEm produção, isso encerraria a sessão e redirecionaria para a tela de login.');
                        // window.location.href = 'login.html';
                    }
                    break;
            }
        });
    });

    // Initialize badge count
    updateNotificationBadge();

    // Simular novas notificações (apenas para demonstração)
    // setTimeout(() => {
    //     addNewNotification({
    //         type: 'success',
    //         title: 'Pagamento Recebido',
    //         message: 'Pagamento de R$ 1.500,00 confirmado',
    //         time: 'Agora'
    //     });
    // }, 5000);

    function addNewNotification(notification) {
        const notificationList = document.querySelector('.notification-list');
        if (!notificationList) return;

        const notificationHTML = `
            <div class="notification-item unread" data-type="${notification.type}">
                <div class="notification-icon ${notification.type}">
                    <i class="fas fa-${getIconByType(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">
                        <i class="far fa-clock"></i>
                        ${notification.time}
                    </div>
                </div>
            </div>
        `;

        notificationList.insertAdjacentHTML('afterbegin', notificationHTML);
        updateNotificationBadge();
    }

    function getIconByType(type) {
        const icons = {
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'times-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'bell';
    }
});
