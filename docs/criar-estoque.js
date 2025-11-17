// criar-estoque.js - JavaScript para o formulário de cadastro de produtos

document.addEventListener('DOMContentLoaded', function() {

    // Form elements
    const form = document.getElementById('createProductForm');
    const controleLoteCheckbox = document.getElementById('controleLote');
    const controleValidadeCheckbox = document.getElementById('controleValidade');
    const loteGroup = document.getElementById('loteGroup');
    const validadeGroup = document.getElementById('validadeGroup');
    const fabricacaoGroup = document.getElementById('fabricacaoGroup');
    const custoUnitarioInput = document.getElementById('custoUnitario');
    const precoVendaInput = document.getElementById('precoVenda');
    const margemLucroInput = document.getElementById('margemLucro');

    // Toggle Lote fields
    if (controleLoteCheckbox && loteGroup) {
        controleLoteCheckbox.addEventListener('change', function() {
            if (this.checked) {
                loteGroup.style.display = 'block';
                fabricacaoGroup.style.display = 'block';
            } else {
                loteGroup.style.display = 'none';
                fabricacaoGroup.style.display = 'none';
            }
        });
    }

    // Toggle Validade fields
    if (controleValidadeCheckbox && validadeGroup) {
        controleValidadeCheckbox.addEventListener('change', function() {
            if (this.checked) {
                validadeGroup.style.display = 'block';
            } else {
                validadeGroup.style.display = 'none';
            }
        });
    }

    // Money Mask for financial inputs
    const moneyInputs = [custoUnitarioInput, precoVendaInput];

    function formatMoney(value) {
        value = value.replace(/\D/g, '');
        value = (parseInt(value) / 100).toFixed(2);

        if (!isNaN(value) && value !== '0.00') {
            value = value.replace('.', ',');
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            return 'R$ ' + value;
        }
        return '';
    }

    function parseMoney(value) {
        if (!value) return 0;
        value = value.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
        return parseFloat(value) || 0;
    }

    moneyInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function(e) {
                e.target.value = formatMoney(e.target.value);

                // Calculate margin if both values are filled
                if (input === custoUnitarioInput || input === precoVendaInput) {
                    calculateMargin();
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

    // Calculate profit margin
    function calculateMargin() {
        const custo = parseMoney(custoUnitarioInput.value);
        const venda = parseMoney(precoVendaInput.value);

        if (custo > 0 && venda > 0) {
            const margem = ((venda - custo) / venda) * 100;
            margemLucroInput.value = margem.toFixed(2);
        } else {
            margemLucroInput.value = '';
        }
    }

    // Generate automatic product code
    const codigoProdutoInput = document.getElementById('codigoProduto');
    const categoriaSelect = document.getElementById('categoria');

    if (categoriaSelect && codigoProdutoInput) {
        categoriaSelect.addEventListener('change', function() {
            const categoria = this.value;
            const prefixos = {
                'quimicos': 'QUI',
                'embalagem': 'EMB',
                'reposicao': 'REP',
                'uniformes': 'UNI',
                'outros': 'OUT'
            };

            if (categoria && prefixos[categoria]) {
                const numero = Math.floor(Math.random() * 9000) + 1000;
                codigoProdutoInput.value = `${prefixos[categoria]}-${numero}`;
            }
        });
    }

    // Barcode mask
    const codigoBarrasInput = document.getElementById('codigoBarras');
    if (codigoBarrasInput) {
        codigoBarrasInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 13) {
                value = value.substring(0, 13);
            }
            e.target.value = value;
        });
    }

    // NCM mask
    const ncmInput = document.getElementById('ncm');
    if (ncmInput) {
        ncmInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length <= 8) {
                value = value.replace(/^(\d{4})(\d)/, '$1.$2');
                value = value.replace(/(\d{2})(\d)/, '$1.$2');
            }

            e.target.value = value;
        });
    }

    // Form Validation and Submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate required fields
            const nomeProduto = document.getElementById('nomeProduto').value;
            const categoria = document.getElementById('categoria').value;
            const unidadeMedida = document.getElementById('unidadeMedida').value;
            const estoqueInicial = document.getElementById('estoqueInicial').value;
            const estoqueMinimo = document.getElementById('estoqueMinimo').value;

            if (!nomeProduto || !categoria || !unidadeMedida) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return false;
            }

            if (parseFloat(estoqueInicial) < 0 || parseFloat(estoqueMinimo) < 0) {
                alert('Os valores de estoque não podem ser negativos.');
                return false;
            }

            // Validate stock levels
            const estoqueMax = document.getElementById('estoqueMaximo').value;
            if (estoqueMax && parseFloat(estoqueInicial) > parseFloat(estoqueMax)) {
                alert('O estoque inicial não pode ser maior que o estoque máximo.');
                return false;
            }

            if (parseFloat(estoqueInicial) < parseFloat(estoqueMinimo)) {
                const confirmLow = confirm('O estoque inicial está abaixo do mínimo. Deseja continuar?');
                if (!confirmLow) {
                    return false;
                }
            }

            // Collect form data
            const formData = {
                codigo: document.getElementById('codigoProduto').value,
                codigoBarras: document.getElementById('codigoBarras').value,
                nome: nomeProduto,
                categoria: categoria,
                unidadeMedida: unidadeMedida,
                marca: document.getElementById('marca').value,
                modelo: document.getElementById('modelo').value,
                descricao: document.getElementById('descricao').value,
                estoque: {
                    inicial: estoqueInicial,
                    minimo: estoqueMinimo,
                    maximo: estoqueMax,
                    pontoPedido: document.getElementById('pontoPedido').value,
                    loteCompra: document.getElementById('loteCompra').value,
                    localizacao: document.getElementById('localizacao').value
                },
                financeiro: {
                    custoUnitario: custoUnitarioInput.value,
                    precoVenda: precoVendaInput.value,
                    margemLucro: margemLucroInput.value,
                    ncm: document.getElementById('ncm').value
                },
                fornecedor: {
                    id: document.getElementById('fornecedor').value,
                    codigo: document.getElementById('codigoFornecedor').value,
                    prazoEntrega: document.getElementById('prazoEntrega').value,
                    ultimaCompra: document.getElementById('ultimaCompra').value
                },
                controles: {
                    lote: controleLoteCheckbox.checked,
                    validade: controleValidadeCheckbox.checked,
                    numeroLote: document.getElementById('numeroLote').value,
                    dataValidade: document.getElementById('dataValidade').value,
                    dataFabricacao: document.getElementById('dataFabricacao').value
                },
                observacoes: document.getElementById('observacoes').value
            };

            console.log('Dados do produto:', formData);

            // Check for critical stock
            if (parseFloat(estoqueInicial) <= parseFloat(estoqueMinimo)) {
                alert('Produto cadastrado com ESTOQUE CRÍTICO!\n\nRecomenda-se fazer um pedido de reposição imediatamente.');
            } else {
                alert('Produto cadastrado com sucesso!\n\nEm produção, os dados seriam enviados ao servidor.');
            }

            // Opcional: redirecionar para a lista de estoque
            // window.location.href = 'estoque.html';
        });
    }

    // Save Draft
    const saveDraftBtn = document.getElementById('saveDraft');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            console.log('Salvando rascunho...');

            // Save to localStorage
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            localStorage.setItem('produtoDraft', JSON.stringify(data));

            alert('Rascunho salvo com sucesso!');
        });
    }

    // Load draft on page load
    function loadDraft() {
        const draft = localStorage.getItem('produtoDraft');
        if (draft) {
            const shouldLoad = confirm('Existe um rascunho salvo. Deseja carregá-lo?');
            if (shouldLoad) {
                const data = JSON.parse(draft);
                Object.keys(data).forEach(key => {
                    const element = document.getElementById(key);
                    if (element) {
                        if (element.type === 'checkbox') {
                            element.checked = data[key] === 'on';
                        } else {
                            element.value = data[key];
                        }
                    }
                });

                // Trigger change events for conditional fields
                if (data.controleLote === 'on') {
                    controleLoteCheckbox.checked = true;
                    controleLoteCheckbox.dispatchEvent(new Event('change'));
                }
                if (data.controleValidade === 'on') {
                    controleValidadeCheckbox.checked = true;
                    controleValidadeCheckbox.dispatchEvent(new Event('change'));
                }

                localStorage.removeItem('produtoDraft');
            }
        }
    }

    // Uncomment to enable draft loading
    // loadDraft();

    // Auto-calculate reorder point
    const estoqueInicialInput = document.getElementById('estoqueInicial');
    const estoqueMaximoInput = document.getElementById('estoqueMaximo');
    const pontoPedidoInput = document.getElementById('pontoPedido');

    function calculateReorderPoint() {
        const minimo = parseFloat(document.getElementById('estoqueMinimo').value) || 0;
        const maximo = parseFloat(estoqueMaximoInput.value) || 0;

        if (minimo > 0 && maximo > 0) {
            // Suggest reorder point as 30% of max stock
            const suggestedPoint = Math.ceil(maximo * 0.3);
            if (!pontoPedidoInput.value) {
                pontoPedidoInput.value = suggestedPoint;
            }
        }
    }

    if (estoqueMaximoInput) {
        estoqueMaximoInput.addEventListener('blur', calculateReorderPoint);
    }
});
