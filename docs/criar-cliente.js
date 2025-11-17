// criar-cliente.js - JavaScript para o formulário de cadastro de clientes

document.addEventListener('DOMContentLoaded', function() {

    // Form elements
    const form = document.getElementById('createClientForm');
    const cnpjInput = document.getElementById('cnpj');
    const cepInput = document.getElementById('cep');
    const telefoneInputs = [
        document.getElementById('telefonePrincipal'),
        document.getElementById('telefoneSecundario'),
        document.getElementById('whatsapp')
    ];

    // CNPJ Mask
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length <= 14) {
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }

            e.target.value = value;
        });
    }

    // CEP Mask and Auto-fill
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length <= 8) {
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            }

            e.target.value = value;
        });

        cepInput.addEventListener('blur', function() {
            const cep = this.value.replace(/\D/g, '');

            if (cep.length === 8) {
                // Buscar CEP na API ViaCEP
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.erro) {
                            document.getElementById('logradouro').value = data.logradouro || '';
                            document.getElementById('bairro').value = data.bairro || '';
                            document.getElementById('cidade').value = data.localidade || '';

                            // Selecionar estado
                            const estadoSelect = document.getElementById('estado');
                            if (estadoSelect) {
                                estadoSelect.value = data.uf || '';
                            }

                            // Focar no campo número
                            document.getElementById('numero').focus();
                        } else {
                            alert('CEP não encontrado.');
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao buscar CEP:', error);
                        alert('Erro ao buscar CEP. Por favor, preencha manualmente.');
                    });
            }
        });
    }

    // Phone Mask
    telefoneInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');

                if (value.length <= 11) {
                    if (value.length <= 10) {
                        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                        value = value.replace(/(\d{4})(\d)/, '$1-$2');
                    } else {
                        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                        value = value.replace(/(\d{5})(\d)/, '$1-$2');
                    }
                }

                e.target.value = value;
            });
        }
    });

    // Money Mask for Limite de Crédito and Preço por Kg
    const moneyInputs = [
        document.getElementById('limiteCredito'),
        document.getElementById('precoKg')
    ];

    moneyInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = (parseInt(value) / 100).toFixed(2);

                if (!isNaN(value) && value !== '0.00') {
                    value = value.replace('.', ',');
                    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                    e.target.value = 'R$ ' + value;
                } else if (e.target.value === '') {
                    e.target.value = '';
                }
            });

            input.addEventListener('focus', function(e) {
                if (e.target.value === 'R$ 0,00') {
                    e.target.value = '';
                }
            });

            input.addEventListener('blur', function(e) {
                if (e.target.value === '' || e.target.value === 'R$ ') {
                    e.target.value = '';
                }
            });
        }
    });

    // Form Validation
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validar CNPJ
            const cnpj = cnpjInput.value.replace(/\D/g, '');
            if (cnpj.length !== 14) {
                alert('CNPJ inválido. Digite um CNPJ com 14 dígitos.');
                cnpjInput.focus();
                return false;
            }

            // Validar CEP
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length !== 8) {
                alert('CEP inválido. Digite um CEP com 8 dígitos.');
                cepInput.focus();
                return false;
            }

            // Validar Email
            const emailPrincipal = document.getElementById('emailPrincipal').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailPrincipal)) {
                alert('Email principal inválido.');
                document.getElementById('emailPrincipal').focus();
                return false;
            }

            // Se todas as validações passarem
            const formData = {
                razaoSocial: document.getElementById('razaoSocial').value,
                nomeFantasia: document.getElementById('nomeFantasia').value,
                cnpj: cnpj,
                inscricaoEstadual: document.getElementById('inscricaoEstadual').value,
                tipoEstabelecimento: document.getElementById('tipoEstabelecimento').value,
                numeroQuartos: document.getElementById('numeroQuartos').value,
                status: document.getElementById('status').value,
                endereco: {
                    cep: cep,
                    logradouro: document.getElementById('logradouro').value,
                    numero: document.getElementById('numero').value,
                    complemento: document.getElementById('complemento').value,
                    bairro: document.getElementById('bairro').value,
                    cidade: document.getElementById('cidade').value,
                    estado: document.getElementById('estado').value,
                    pontoReferencia: document.getElementById('pontoReferencia').value
                },
                contato: {
                    nomeResponsavel: document.getElementById('nomeResponsavel').value,
                    cargo: document.getElementById('cargo').value,
                    telefonePrincipal: document.getElementById('telefonePrincipal').value,
                    telefoneSecundario: document.getElementById('telefoneSecundario').value,
                    emailPrincipal: emailPrincipal,
                    emailSecundario: document.getElementById('emailSecundario').value,
                    whatsapp: document.getElementById('whatsapp').value,
                    site: document.getElementById('site').value
                },
                comercial: {
                    formaPagamento: document.getElementById('formaPagamento').value,
                    prazoPagamento: document.getElementById('prazoPagamento').value,
                    diaVencimento: document.getElementById('diaVencimento').value,
                    limiteCredito: document.getElementById('limiteCredito').value,
                    desconto: document.getElementById('desconto').value,
                    precoKg: document.getElementById('precoKg').value,
                    observacoesComerciais: document.getElementById('observacoesComerciais').value
                },
                observacoes: document.getElementById('observacoes').value
            };

            console.log('Dados do formulário:', formData);

            // Aqui você enviaria os dados para o servidor
            // Por enquanto, apenas mostra uma mensagem de sucesso
            alert('Cliente cadastrado com sucesso!\n\nEm produção, os dados seriam enviados ao servidor.');

            // Opcional: redirecionar para a lista de clientes
            // window.location.href = 'clientes.html';
        });
    }

    // Save Draft
    const saveDraftBtn = document.querySelector('.btn-secondary[type="button"]:not([onclick])');
    if (saveDraftBtn && saveDraftBtn.textContent.includes('Salvar Rascunho')) {
        saveDraftBtn.addEventListener('click', function() {
            console.log('Salvando rascunho...');
            alert('Rascunho salvo com sucesso!');
        });
    }

    // Auto-save (opcional - salvar no localStorage a cada X segundos)
    let autoSaveInterval;

    function enableAutoSave() {
        autoSaveInterval = setInterval(() => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            localStorage.setItem('clienteDraft', JSON.stringify(data));
            console.log('Rascunho salvo automaticamente');
        }, 60000); // A cada 60 segundos
    }

    // Carregar rascunho salvo
    function loadDraft() {
        const draft = localStorage.getItem('clienteDraft');
        if (draft) {
            const shouldLoad = confirm('Existe um rascunho salvo. Deseja carregá-lo?');
            if (shouldLoad) {
                const data = JSON.parse(draft);
                Object.keys(data).forEach(key => {
                    const element = document.getElementById(key);
                    if (element) {
                        element.value = data[key];
                    }
                });
            }
        }
    }

    // Uncomment to enable auto-save and draft loading
    // loadDraft();
    // enableAutoSave();
});
