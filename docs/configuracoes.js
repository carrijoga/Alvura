// configuracoes.js - JavaScript para a tela de configurações

document.addEventListener('DOMContentLoaded', function() {
    // Tab/Section Switching
    const menuItems = document.querySelectorAll('.settings-menu-item');
    const sections = document.querySelectorAll('.settings-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');

            // Update active menu item
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            sections.forEach(section => {
                if (section.id === sectionId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // Logo Upload Preview
    const logoUpload = document.getElementById('logoUpload');
    const logoPreview = document.getElementById('logoPreview');

    if (logoUpload) {
        logoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    logoPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Avatar Upload Preview
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('avatarPreview');

    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Password visibility toggles
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Theme Selector
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            const theme = this.getAttribute('data-theme');
            console.log(`Tema selecionado: ${theme}`);

            // In production, apply theme to document
            // document.documentElement.setAttribute('data-theme', theme);
        });
    });

    // Empresa Form
    const empresaForm = document.getElementById('empresaForm');
    if (empresaForm) {
        empresaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Salvando dados da empresa...');

            // Simulate save
            setTimeout(() => {
                alert('Dados da empresa salvos com sucesso!');
            }, 500);
        });
    }

    // Profile Form
    const perfilForm = document.getElementById('perfilForm');
    if (perfilForm) {
        perfilForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Salvando perfil...');

            // Simulate save
            setTimeout(() => {
                alert('Perfil atualizado com sucesso!');
            }, 500);
        });
    }

    // Password Change Form
    const senhaForm = document.getElementById('senhaForm');
    if (senhaForm) {
        senhaForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const senhaAtual = document.getElementById('senhaAtual').value;
            const novaSenha = document.getElementById('novaSenha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;

            if (novaSenha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }

            if (novaSenha.length < 8) {
                alert('A senha deve ter pelo menos 8 caracteres!');
                return;
            }

            console.log('Alterando senha...');

            // Simulate password change
            setTimeout(() => {
                alert('Senha alterada com sucesso!');
                senhaForm.reset();
            }, 500);
        });
    }

    // System Settings Form
    const sistemaForm = document.getElementById('sistemaForm');
    if (sistemaForm) {
        sistemaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Salvando configurações do sistema...');

            // Simulate save
            setTimeout(() => {
                alert('Configurações do sistema salvas com sucesso!');
            }, 500);
        });
    }

    // Notification Settings Form
    const notificacoesForm = document.getElementById('notificacoesForm');
    if (notificacoesForm) {
        notificacoesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Salvando preferências de notificações...');

            // Simulate save
            setTimeout(() => {
                alert('Preferências de notificações salvas com sucesso!');
            }, 500);
        });
    }

    // Security Settings Form
    const segurancaForm = document.getElementById('segurancaForm');
    if (segurancaForm) {
        segurancaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Salvando configurações de segurança...');

            // Simulate save
            setTimeout(() => {
                alert('Configurações de segurança salvas com sucesso!');
            }, 500);
        });
    }

    // Terminate Session Buttons
    const terminateButtons = document.querySelectorAll('.btn-action[title="Encerrar Sessão"]');
    terminateButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            if (confirm('Deseja realmente encerrar esta sessão?')) {
                const row = this.closest('tr');
                const device = row.cells[0].textContent;

                console.log(`Encerrando sessão: ${device}`);

                // Simulate session termination
                setTimeout(() => {
                    row.remove();
                    alert('Sessão encerrada com sucesso!');
                }, 500);
            }
        });
    });

    // API Key Copy
    const copyKeyBtn = document.getElementById('copyApiKey');
    if (copyKeyBtn) {
        copyKeyBtn.addEventListener('click', function() {
            const apiKey = document.getElementById('apiKey').value;

            navigator.clipboard.writeText(apiKey).then(() => {
                // Change icon temporarily
                const icon = this.querySelector('i');
                const originalClass = icon.className;
                icon.className = 'fas fa-check';

                setTimeout(() => {
                    icon.className = originalClass;
                }, 2000);

                console.log('API Key copiada para área de transferência');
            }).catch(err => {
                alert('Erro ao copiar API Key');
                console.error(err);
            });
        });
    }

    // Regenerate API Key
    const regenerateKeyBtn = document.getElementById('regenerateApiKey');
    if (regenerateKeyBtn) {
        regenerateKeyBtn.addEventListener('click', function() {
            if (confirm('Deseja realmente regenerar a API Key? A chave atual será invalidada.')) {
                console.log('Regenerando API Key...');

                // Simulate key regeneration
                setTimeout(() => {
                    const newKey = 'alvura_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    document.getElementById('apiKey').value = newKey;
                    alert('Nova API Key gerada com sucesso!');
                }, 500);
            }
        });
    }

    // Integration Connection Buttons
    const connectWhatsApp = document.querySelector('.btn-primary[onclick*="whatsapp"]');
    if (connectWhatsApp) {
        connectWhatsApp.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Conectando WhatsApp Business...');

            // Simulate connection
            setTimeout(() => {
                alert('WhatsApp Business conectado com sucesso!\n\nEm produção, isso abriria um QR Code para autenticação.');
            }, 500);
        });
    }

    const configureEmail = document.querySelector('.btn-secondary[onclick*="email"]');
    if (configureEmail) {
        configureEmail.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Configurando SMTP...');

            // Show configuration modal
            alert('Configuração de SMTP\n\nEm produção, isso abriria um modal com campos para:\n- Servidor SMTP\n- Porta\n- Usuário\n- Senha\n- SSL/TLS');
        });
    }

    const connectPayment = document.querySelector('.btn-primary[onclick*="pagamento"]');
    if (connectPayment) {
        connectPayment.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Conectando Gateway de Pagamento...');

            // Simulate connection
            setTimeout(() => {
                alert('Gateway de Pagamento\n\nEm produção, isso abriria um formulário para configurar:\n- Chave Pública\n- Chave Privada\n- Webhook URL');
            }, 500);
        });
    }

    // Fiscal Settings Form
    const fiscalForm = document.getElementById('fiscalForm');
    if (fiscalForm) {
        fiscalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Salvando configurações fiscais...');

            // Simulate save
            setTimeout(() => {
                alert('Configurações fiscais salvas com sucesso!');
            }, 500);
        });
    }

    // Backup Settings Form
    const backupForm = document.getElementById('backupForm');
    if (backupForm) {
        backupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Salvando configurações de backup...');

            // Simulate save
            setTimeout(() => {
                alert('Configurações de backup salvas com sucesso!');
            }, 500);
        });
    }

    // Manual Backup Button
    const manualBackupBtn = document.getElementById('manualBackup');
    if (manualBackupBtn) {
        manualBackupBtn.addEventListener('click', function() {
            const btn = this;
            const originalText = btn.innerHTML;

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando backup...';

            console.log('Criando backup manual...');

            // Simulate backup creation
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                alert('Backup criado com sucesso!\n\nArquivo: backup_manual_' + new Date().toISOString().split('T')[0] + '.zip\nTamanho: 45.8 MB');
            }, 3000);
        });
    }

    // Backup Action Buttons
    const downloadBackupButtons = document.querySelectorAll('.btn-action[title="Download"]');
    downloadBackupButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const filename = row.cells[0].textContent;

            console.log(`Baixando backup: ${filename}`);
            alert(`Download iniciado: ${filename}\n\nEm produção, isso baixaria o arquivo de backup.`);
        });
    });

    const restoreBackupButtons = document.querySelectorAll('.btn-action[title="Restaurar"]');
    restoreBackupButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const filename = row.cells[0].textContent;

            if (confirm(`ATENÇÃO!\n\nRestaurar este backup irá sobrescrever todos os dados atuais.\n\nDeseja continuar?\n\nBackup: ${filename}`)) {
                console.log(`Restaurando backup: ${filename}`);
                alert('Restauração de backup em andamento...\n\nEm produção, isso restauraria o sistema ao estado do backup.');
            }
        });
    });

    const deleteBackupButtons = document.querySelectorAll('.btn-action[title="Excluir"]');
    deleteBackupButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const filename = row.cells[0].textContent;

            if (confirm(`Deseja realmente excluir este backup?\n\n${filename}\n\nEsta ação não pode ser desfeita.`)) {
                console.log(`Excluindo backup: ${filename}`);

                // Simulate deletion
                setTimeout(() => {
                    row.remove();
                    alert('Backup excluído com sucesso!');
                }, 500);
            }
        });
    });

    // Cancel buttons for all forms
    const cancelButtons = document.querySelectorAll('.btn-secondary');
    cancelButtons.forEach(btn => {
        if (btn.textContent.includes('Cancelar')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();

                if (confirm('Deseja descartar as alterações?')) {
                    const form = this.closest('form');
                    if (form) {
                        form.reset();
                        console.log('Alterações descartadas');
                    }
                }
            });
        }
    });

    console.log('Configurações inicializadas');
});
