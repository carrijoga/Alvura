// criar-relatorio.js - JavaScript para o gerador de relatórios

document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('createReportForm');
    const categoriaSelect = document.getElementById('categoriaRelatorio');
    const tipoRelatorioSelect = document.getElementById('tipoRelatorio');
    const tipoPeriodoSelect = document.getElementById('tipoPeriodo');
    const dataInicialGroup = document.getElementById('dataInicialGroup');
    const dataFinalGroup = document.getElementById('dataFinalGroup');
    const enviarEmailCheckbox = document.getElementById('enviarEmail');
    const emailOptions = document.getElementById('emailOptions');

    // Dynamic report types based on category
    if (categoriaSelect && tipoRelatorioSelect) {
        categoriaSelect.addEventListener('change', function() {
            const categoria = this.value;

            // Hide all optgroups
            const optgroups = tipoRelatorioSelect.querySelectorAll('optgroup');
            optgroups.forEach(opt => {
                opt.style.display = 'none';
            });

            // Show relevant optgroup
            if (categoria === 'financeiro') {
                document.getElementById('optFinanceiro').style.display = 'block';
            } else if (categoria === 'operacional') {
                document.getElementById('optOperacional').style.display = 'block';
            } else if (categoria === 'comercial') {
                document.getElementById('optComercial').style.display = 'block';
            } else if (categoria === 'estoque') {
                document.getElementById('optEstoque').style.display = 'block';
            } else if (categoria === 'gerencial') {
                document.getElementById('optGerencial').style.display = 'block';
            }

            // Reset tipo selection
            tipoRelatorioSelect.value = '';
        });
    }

    // Period type handler
    if (tipoPeriodoSelect) {
        tipoPeriodoSelect.addEventListener('change', function() {
            const tipoPeriodo = this.value;

            if (tipoPeriodo === 'personalizado') {
                dataInicialGroup.style.display = 'block';
                dataFinalGroup.style.display = 'block';

                // Make dates required
                document.getElementById('dataInicial').required = true;
                document.getElementById('dataFinal').required = true;
            } else {
                dataInicialGroup.style.display = 'none';
                dataFinalGroup.style.display = 'none';

                // Remove required
                document.getElementById('dataInicial').required = false;
                document.getElementById('dataFinal').required = false;
            }

            // Auto-fill dates for predefined periods
            const hoje = new Date();
            let dataInicial, dataFinal;

            switch(tipoPeriodo) {
                case 'hoje':
                    dataInicial = dataFinal = hoje.toISOString().split('T')[0];
                    break;
                case 'ontem':
                    const ontem = new Date(hoje);
                    ontem.setDate(ontem.getDate() - 1);
                    dataInicial = dataFinal = ontem.toISOString().split('T')[0];
                    break;
                case 'esta-semana':
                    const primeiroDia = new Date(hoje);
                    primeiroDia.setDate(hoje.getDate() - hoje.getDay());
                    dataInicial = primeiroDia.toISOString().split('T')[0];
                    dataFinal = hoje.toISOString().split('T')[0];
                    break;
                case 'este-mes':
                    dataInicial = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
                    dataFinal = hoje.toISOString().split('T')[0];
                    break;
                case 'mes-passado':
                    const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
                    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
                    dataInicial = mesPassado.toISOString().split('T')[0];
                    dataFinal = ultimoDiaMes.toISOString().split('T')[0];
                    break;
            }

            if (dataInicial && dataFinal && tipoPeriodo !== 'personalizado') {
                document.getElementById('dataInicial').value = dataInicial;
                document.getElementById('dataFinal').value = dataFinal;
            }
        });
    }

    // Email options toggle
    if (enviarEmailCheckbox && emailOptions) {
        enviarEmailCheckbox.addEventListener('change', function() {
            if (this.checked) {
                emailOptions.style.display = 'block';
            } else {
                emailOptions.style.display = 'none';
            }
        });
    }

    // Auto-generate report name
    function generateReportName() {
        const categoria = categoriaSelect.value;
        const tipo = tipoRelatorioSelect.value;
        const periodo = tipoPeriodoSelect.value;

        if (categoria && tipo) {
            const tipoText = tipoRelatorioSelect.options[tipoRelatorioSelect.selectedIndex].text;
            const mes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

            let nome = tipoText;

            if (periodo === 'este-mes') {
                nome += ` - ${mes}`;
            } else if (periodo === 'este-ano') {
                nome += ` - ${new Date().getFullYear()}`;
            }

            document.getElementById('nomeRelatorio').value = nome;
        }
    }

    if (categoriaSelect && tipoRelatorioSelect) {
        tipoRelatorioSelect.addEventListener('change', generateReportName);
        tipoPeriodoSelect.addEventListener('change', generateReportName);
    }

    // Form validation and submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate required fields
            const nome = document.getElementById('nomeRelatorio').value;
            const categoria = categoriaSelect.value;
            const tipo = tipoRelatorioSelect.value;
            const tipoPeriodo = tipoPeriodoSelect.value;
            const formato = document.getElementById('formatoSaida').value;

            if (!nome || !categoria || !tipo || !tipoPeriodo || !formato) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return false;
            }

            // Validate custom period dates
            if (tipoPeriodo === 'personalizado') {
                const dataInicial = document.getElementById('dataInicial').value;
                const dataFinal = document.getElementById('dataFinal').value;

                if (!dataInicial || !dataFinal) {
                    alert('Por favor, preencha as datas inicial e final.');
                    return false;
                }

                if (new Date(dataInicial) > new Date(dataFinal)) {
                    alert('A data inicial não pode ser maior que a data final.');
                    return false;
                }
            }

            // Validate email if sending
            if (enviarEmailCheckbox.checked) {
                const emails = document.getElementById('emailDestinatarios').value;
                if (!emails) {
                    alert('Por favor, informe pelo menos um email de destino.');
                    return false;
                }

                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const emailList = emails.split(',').map(e => e.trim());
                const invalidEmails = emailList.filter(email => !emailRegex.test(email));

                if (invalidEmails.length > 0) {
                    alert(`Emails inválidos: ${invalidEmails.join(', ')}`);
                    return false;
                }
            }

            // Collect form data
            const formData = {
                nome: nome,
                categoria: categoria,
                tipo: tipo,
                periodo: {
                    tipo: tipoPeriodo,
                    dataInicial: document.getElementById('dataInicial').value,
                    dataFinal: document.getElementById('dataFinal').value
                },
                filtros: {
                    cliente: document.getElementById('filtroCliente').value,
                    status: document.getElementById('filtroStatus').value,
                    categoriaEstoque: document.getElementById('filtroCategoriaEstoque').value,
                    responsavel: document.getElementById('filtroResponsavel').value
                },
                saida: {
                    formato: formato,
                    orientacao: document.getElementById('orientacao').value,
                    incluirGraficos: document.getElementById('incluirGraficos').checked,
                    incluirDetalhamento: document.getElementById('incluirDetalhamento').checked,
                    agruparPorPeriodo: document.getElementById('agruparPorPeriodo').checked,
                    compararPeriodoAnterior: document.getElementById('compararPeriodoAnterior').checked
                },
                email: {
                    enviar: enviarEmailCheckbox.checked,
                    destinatarios: document.getElementById('emailDestinatarios').value,
                    mensagem: document.getElementById('emailMensagem').value
                }
            };

            console.log('Gerando relatório:', formData);

            // Show processing message
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando Relatório...';

            // Simulate report generation
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                if (formato === 'html') {
                    alert('Relatório gerado com sucesso!\n\nRedirecionando para visualização...');
                    window.location.href = 'detalhes-relatorio.html';
                } else {
                    alert(`Relatório gerado com sucesso!\n\nFormato: ${formato.toUpperCase()}\n\nEm produção, o download seria iniciado automaticamente.`);
                    window.location.href = 'relatorios.html';
                }
            }, 2000);
        });
    }

    // Save as template
    const saveTemplateBtn = document.getElementById('saveTemplate');
    if (saveTemplateBtn) {
        saveTemplateBtn.addEventListener('click', function() {
            const nome = document.getElementById('nomeRelatorio').value;

            if (!nome) {
                alert('Por favor, informe um nome para o modelo.');
                return;
            }

            const templateName = prompt('Nome do modelo:', nome + ' (Modelo)');

            if (templateName) {
                console.log('Salvando modelo:', templateName);

                // Save to localStorage
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                localStorage.setItem(`reportTemplate_${Date.now()}`, JSON.stringify(data));

                alert('Modelo salvo com sucesso!\n\nVocê poderá reutilizar este modelo para gerar relatórios futuros.');
            }
        });
    }

    // Format output change handler
    const formatoSaidaSelect = document.getElementById('formatoSaida');
    const orientacaoSelect = document.getElementById('orientacao');

    if (formatoSaidaSelect && orientacaoSelect) {
        formatoSaidaSelect.addEventListener('change', function() {
            if (this.value === 'pdf') {
                orientacaoSelect.disabled = false;
            } else {
                orientacaoSelect.disabled = true;
            }
        });
    }

    // Help tooltips (optional enhancement)
    const helpIcons = document.querySelectorAll('.form-help');
    helpIcons.forEach(help => {
        help.style.cursor = 'help';
    });
});
