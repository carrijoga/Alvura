// Dropdown de Notificações
const notificationBtn = document.getElementById('notificationBtn');
const notificationDropdown = document.getElementById('notificationDropdown');
notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
    userDropdown.style.display = 'none';
});

// Dropdown de Usuário
const userMenuBtn = document.getElementById('userMenuBtn');
const userDropdown = document.getElementById('userDropdown');
userMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
    notificationDropdown.style.display = 'none';
});

// Fechar dropdowns ao clicar fora
document.addEventListener('click', () => {
    notificationDropdown.style.display = 'none';
    userDropdown.style.display = 'none';
});
// Menu Toggle para Mobile
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Fechar sidebar ao clicar fora (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Period Selector
const periodButtons = document.querySelectorAll('.period-btn');
periodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        periodButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Aqui você pode adicionar lógica para atualizar os dados baseado no período
        console.log('Período selecionado:', btn.textContent);
    });
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
const ordersTableBody = document.getElementById('ordersTableBody');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = ordersTableBody.getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Chart.js Configuration
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#757575';

// Produtividade Chart (Bar Chart)
const productivityCtx = document.getElementById('productivityChart').getContext('2d');
const productivityChart = new Chart(productivityCtx, {
    type: 'bar',
    data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [{
            label: 'Kg Lavados',
            data: [1450, 1620, 1380, 1750, 1890, 1100, 790],
            backgroundColor: '#2196F3',
            borderRadius: 6,
            barThickness: 40,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return context.parsed.y + ' kg';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function(value) {
                        return value + ' kg';
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});

// Status Chart (Donut Chart)
const statusCtx = document.getElementById('statusChart').getContext('2d');
const statusChart = new Chart(statusCtx, {
    type: 'doughnut',
    data: {
        labels: ['Recebido', 'Em Lavagem', 'Secagem', 'Pronto'],
        datasets: [{
            data: [12, 15, 8, 10],
            backgroundColor: [
                '#FFC107',
                '#2196F3',
                '#9E9E9E',
                '#4CAF50'
            ],
            borderWidth: 0,
            hoverOffset: 8
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return label + ': ' + value + ' (' + percentage + '%)';
                    }
                }
            }
        }
    }
});

// Animação de contadores nos cards
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        if (element.textContent.includes('R$')) {
            element.textContent = 'R$ ' + Math.floor(progress * (end - start) + start).toLocaleString('pt-BR');
        } else {
            element.textContent = Math.floor(progress * (end - start) + start);
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animar valores dos cards quando a página carregar
window.addEventListener('load', () => {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach((element) => {
        const text = element.textContent;
        let endValue;
        
        if (text.includes('R$')) {
            endValue = parseInt(text.replace(/\D/g, ''));
            animateValue(element, 0, endValue, 1500);
        } else {
            endValue = parseInt(text);
            animateValue(element, 0, endValue, 1000);
        }
    });
});

// Simular atualização em tempo real (SignalR placeholder)
function simulateRealTimeUpdate() {
    // Aqui você integraria com SignalR para atualizações em tempo real
    console.log('Verificando atualizações...');
}

// Verificar atualizações a cada 30 segundos
setInterval(simulateRealTimeUpdate, 30000);

// Adicionar efeito de hover nos cards
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Função para formatar data
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Função para calcular diferença de dias
function getDaysDifference(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Log de inicialização
console.log('Dashboard Alvura inicializado com sucesso!');
console.log('Versão: 1.0.0');
console.log('Data:', new Date().toLocaleString('pt-BR'));
