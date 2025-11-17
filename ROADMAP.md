# Roadmap - Alvura

## 🎯 Visão Geral

Este documento apresenta o planejamento de desenvolvimento do Alvura, um sistema completo de gestão para lavanderias industriais.

**Última Atualização**: Novembro 2024
**Status Atual**: Fase 2 (Frontend Blazor) em andamento

---

## 📊 Progresso Geral

```
Fase 1 - Protótipos           ████████████████████ 100%
Fase 2 - Frontend Blazor      █████░░░░░░░░░░░░░░░  25%
Fase 3 - Backend API          ░░░░░░░░░░░░░░░░░░░░   0%
Fase 4 - Integrações          ░░░░░░░░░░░░░░░░░░░░   0%
Fase 5 - Avançado             ░░░░░░░░░░░░░░░░░░░░   0%
```

---

## ✅ Fase 1: Protótipos HTML/CSS/JS (Completo)

**Período**: Jan 2024 - Out 2024
**Status**: ✅ 100% Completo

### Entregas

- [x] **Design System**
  - [x] Paleta de cores definida
  - [x] Tipografia (Google Fonts - Inter)
  - [x] Componentes UI padronizados
  - [x] Layout responsivo

- [x] **Páginas HTML (18 no total)**
  - [x] Dashboard com métricas e gráficos
  - [x] Ordens de Serviço (listar, criar, detalhes, editar)
  - [x] Clientes (listar, criar, detalhes, editar)
  - [x] Estoque (listar, criar, detalhes, movimentação)
  - [x] Financeiro (listar faturas, detalhes, pagamentos)
  - [x] Relatórios (dashboard, exportação)
  - [x] Configurações (perfil, sistema)

- [x] **Funcionalidades JavaScript**
  - [x] Menu lateral responsivo
  - [x] Filtros e busca em tempo real
  - [x] Gráficos interativos (Chart.js)
  - [x] Timeline de status animada
  - [x] Modals e validações
  - [x] Cálculos automáticos (totais, subtotais)

- [x] **Deploy**
  - [x] GitHub Pages configurado
  - [x] Domínio customizado: https://alvura.carrijoga.com.br
  - [x] HTTPS habilitado

### Resultados

- **18 páginas** funcionais e interativas
- **~15.500 linhas** de código (HTML/CSS/JS)
- **100% responsivo** (desktop, tablet, mobile)
- **Validação de UX/UI** completa
- **Documentação** dos protótipos

---

## 🚧 Fase 2: Frontend Blazor WebAssembly (Em Andamento)

**Período**: Out 2024 - Fev 2025
**Status**: 🔄 25% Completo

### Objetivos

Migrar protótipos HTML para componentes Blazor reutilizáveis e integrados com MudBlazor.

### Progresso Atual

- [x] **Setup Inicial**
  - [x] Projeto Blazor WASM criado (.NET 10)
  - [x] MudBlazor 8.14.0 integrado
  - [x] PWA habilitado (manifest + service worker)
  - [x] Estrutura de pastas definida

- [x] **Layout e Navegação** (100%)
  - [x] MainLayout implementado
  - [x] NavMenu (sidebar) com 7 links
  - [x] NavUpper (top bar) com breadcrumbs
  - [x] UserMenu com dropdown
  - [x] Notification system com state management
  - [x] Sistema de temas (light/dark) com persistência

- [ ] **Dashboard** (10%)
  - [x] Página shell criada (breadcrumbs)
  - [ ] Cards de métricas
  - [ ] Gráficos (Chart.js ou Blazor Charts)
  - [ ] Tabela de ordens recentes
  - [ ] Seletor de período

- [ ] **Módulo de Ordens** (0%)
  - [ ] OrderList.razor (lista com filtros)
  - [ ] OrderCreate.razor (formulário de criação)
  - [ ] OrderDetails.razor (visualização completa)
  - [ ] OrderEdit.razor (edição)
  - [ ] Componentes reutilizáveis:
    - [ ] StatusBadge.razor
    - [ ] Timeline.razor
    - [ ] OrderItemsTable.razor

- [ ] **Módulo de Clientes** (0%)
  - [ ] ClientList.razor
  - [ ] ClientCreate.razor
  - [ ] ClientDetails.razor
  - [ ] ClientEdit.razor

- [ ] **Módulo de Estoque** (0%)
  - [ ] InventoryList.razor
  - [ ] InventoryDetails.razor
  - [ ] StockMovementDialog.razor

- [ ] **Módulo Financeiro** (0%)
  - [ ] InvoiceList.razor
  - [ ] InvoiceDetails.razor
  - [ ] PaymentDialog.razor

- [ ] **Módulo de Relatórios** (0%)
  - [ ] ReportsPage.razor
  - [ ] ExportDialog.razor
  - [ ] Charts components

- [ ] **Serviços e State Management**
  - [ ] HttpClient configuration
  - [ ] Service interfaces (IOrderService, IClientService, etc.)
  - [ ] Mock services (para desenvolvimento sem backend)
  - [ ] AppState (global state)
  - [ ] LocalStorage service

- [ ] **Autenticação** (0%)
  - [ ] Login page
  - [ ] JWT token handling
  - [ ] AuthenticationStateProvider
  - [ ] Protected routes

### Entregas Esperadas

- **20+ componentes** Blazor reutilizáveis
- **7 módulos** completos
- **Integração com API** (mock data)
- **Testes unitários** básicos
- **Documentação** de componentes

---

## 📅 Fase 3: Backend API (Planejado Q1 2025)

**Período**: Jan 2025 - Abr 2025
**Status**: 📋 Planejado

### Objetivos

Desenvolver API REST completa com ASP.NET Core para alimentar o frontend.

### Planejamento

- [ ] **Setup do Projeto**
  - [ ] Criar solução multi-projeto
  - [ ] Estruturar camadas (API, Core, Application, Infrastructure)
  - [ ] Configurar Dependency Injection
  - [ ] Setup de logging (Serilog)

- [ ] **Banco de Dados**
  - [ ] Modelagem completa (ver [docs/DATABASE.md](docs/DATABASE.md))
  - [ ] Entity Framework Core setup
  - [ ] Migrations iniciais
  - [ ] Seed data (usuários, itens de serviço)
  - [ ] SQL Server connection

- [ ] **Autenticação e Autorização**
  - [ ] ASP.NET Identity setup
  - [ ] JWT token generation
  - [ ] Refresh token mechanism
  - [ ] Role-based authorization (Admin, Manager, Operator, Driver)
  - [ ] Password hashing (BCrypt)

- [ ] **APIs REST** (ver [docs/API.md](docs/API.md))
  - [ ] Orders endpoints (CRUD + status update)
  - [ ] Clients endpoints (CRUD)
  - [ ] Inventory endpoints (CRUD + stock movements)
  - [ ] Financial endpoints (invoices, payments)
  - [ ] Reports endpoints (dashboard metrics, exports)
  - [ ] Users endpoints (CRUD, admin only)

- [ ] **Validações e Segurança**
  - [ ] FluentValidation para DTOs
  - [ ] Input sanitization
  - [ ] CORS configuration
  - [ ] Rate limiting
  - [ ] SQL injection protection (via EF Core)

- [ ] **Real-time Communication**
  - [ ] SignalR Hub setup
  - [ ] Order status updates broadcast
  - [ ] Notifications system

- [ ] **Testes**
  - [ ] Unit tests (xUnit)
  - [ ] Integration tests (WebApplicationFactory)
  - [ ] Cobertura mínima: 70%

- [ ] **Documentação**
  - [ ] Swagger/OpenAPI
  - [ ] API examples
  - [ ] Postman collection

### Entregas Esperadas

- **40+ endpoints** REST
- **Database schema** completo com 10+ tabelas
- **JWT authentication** funcionando
- **SignalR** para updates em tempo real
- **Swagger docs** completo
- **80% test coverage**

---

## 🔌 Fase 4: Integrações Externas (Q2 2025)

**Período**: Mai 2025 - Jul 2025
**Status**: 📋 Planejado

### Objetivos

Integrar serviços externos para aumentar funcionalidades.

### Planejamento

- [ ] **Pagamentos**
  - [ ] Integração com Stripe ou Mercado Pago
  - [ ] Webhook para confirmação de pagamentos
  - [ ] Geração de links de pagamento

- [ ] **Comunicação**
  - [ ] WhatsApp Business API
    - [ ] Notificações automáticas de status
    - [ ] Confirmação de coleta/entrega
  - [ ] Email (SMTP)
    - [ ] Templates de email
    - [ ] Envio de faturas
    - [ ] Confirmações

- [ ] **Documentos Fiscais**
  - [ ] Geração de PDF (invoices)
  - [ ] Integração com emissor de NFe (ex: Focus NFe)
  - [ ] Storage de documentos (Azure Blob Storage)

- [ ] **Geolocalização**
  - [ ] Google Maps API
  - [ ] Rastreamento de motoristas
  - [ ] Cálculo de rotas
  - [ ] Estimativa de tempo de chegada

- [ ] **App Mobile (Motoristas)**
  - [ ] Flutter ou React Native
  - [ ] Login
  - [ ] Lista de ordens do dia
  - [ ] Atualização de status (coletado/entregue)
  - [ ] Captura de assinatura
  - [ ] Modo offline

### Entregas Esperadas

- **4+ integrações** externas funcionando
- **App mobile** básico para motoristas
- **Notificações WhatsApp** automáticas
- **Geração de NFe** integrada

---

## 🚀 Fase 5: Features Avançadas (Q3-Q4 2025)

**Período**: Ago 2025 - Dez 2025
**Status**: 💡 Ideação

### Objetivos

Adicionar funcionalidades avançadas e diferenciais competitivos.

### Planejamento

#### Portal do Cliente (Self-Service)

- [ ] Website para clientes (hotéis)
- [ ] Login exclusivo
- [ ] Visualização de ordens
- [ ] Histórico completo
- [ ] Solicitação de nova coleta
- [ ] Download de faturas
- [ ] Dashboard de consumo

#### Analytics e Business Intelligence

- [ ] Dashboard executivo
- [ ] Relatórios avançados:
  - [ ] Análise de lucratividade por cliente
  - [ ] Previsão de demanda
  - [ ] Performance de motoristas
  - [ ] Análise de estoque (ABC)
- [ ] Exportação para Power BI

#### Machine Learning

- [ ] Previsão de demanda (Prophet ou similar)
- [ ] Detecção de anomalias (picos de uso)
- [ ] Sugestão de precificação dinâmica
- [ ] Análise preditiva de manutenção de equipamentos

#### Controle de Qualidade

- [ ] Checklist de qualidade por ordem
- [ ] Registro fotográfico (antes/depois)
- [ ] Sistema de reclamações
- [ ] SLA tracking

#### Gestão de Estoque Avançada

- [ ] Requisição automática de compra (estoque mínimo)
- [ ] Integração com fornecedores
- [ ] Previsão de consumo (ML)
- [ ] Rastreamento de lote

#### Otimização de Rotas

- [ ] Algoritmo de otimização de rotas
- [ ] Agrupamento de coletas/entregas
- [ ] Redução de custos logísticos

### Entregas Esperadas

- **Portal do cliente** completo
- **Dashboard executivo** com BI
- **2+ modelos de ML** em produção
- **Sistema de qualidade** implementado

---

## 📈 Métricas de Sucesso

### Técnicas

| Métrica | Atual | Meta Q2 2025 | Meta Q4 2025 |
|---------|-------|--------------|--------------|
| **Code Coverage** | 0% | 70% | 80% |
| **API Uptime** | N/A | 99.5% | 99.9% |
| **Page Load Time** | ~2s (protótipos) | <1s | <500ms |
| **Lighthouse Score** | 90 | 95 | 98 |
| **Bundle Size (Blazor)** | 2.5MB | 2MB | 1.5MB |

### Negócio

| Métrica | Meta Q2 2025 | Meta Q4 2025 |
|---------|--------------|--------------|
| **Lavanderias usando** | 5 | 20 |
| **Ordens processadas/mês** | 500 | 2000 |
| **Usuários ativos** | 50 | 200 |
| **Uptime SLA** | 99% | 99.9% |

---

## 🛠️ Stack Tecnológica por Fase

### Fase 1-2 (Frontend)

- **Framework**: Blazor WebAssembly (.NET 10)
- **UI Library**: MudBlazor 8.14.0
- **Charts**: Chart.js
- **State**: Custom AppState
- **PWA**: Service Worker

### Fase 3 (Backend)

- **API**: ASP.NET Core 10 Web API
- **ORM**: Entity Framework Core 10
- **Database**: SQL Server 2019+
- **Auth**: JWT + ASP.NET Identity
- **Real-time**: SignalR
- **Logging**: Serilog
- **Tests**: xUnit + Moq

### Fase 4 (Integrações)

- **Payments**: Stripe/Mercado Pago
- **WhatsApp**: Twilio API
- **Email**: SendGrid
- **PDF**: iTextSharp / QuestPDF
- **Storage**: Azure Blob Storage
- **Maps**: Google Maps API
- **Mobile**: Flutter / React Native

### Fase 5 (Avançado)

- **BI**: Power BI Embedded
- **ML**: ML.NET / Python (scikit-learn)
- **Cache**: Redis
- **Queue**: RabbitMQ / Azure Service Bus
- **Monitoring**: Application Insights

---

## 🗓️ Timeline Visual

```
2024
├── Q1: Planejamento e Design
├── Q2: Protótipos HTML (Módulos 1-4)
├── Q3: Protótipos HTML (Módulos 5-7) + Deploy
└── Q4: ✅ Fase 1 Completa | 🚧 Fase 2 Início

2025
├── Q1: 🚧 Fase 2 (Blazor) | 📋 Fase 3 (Backend)
├── Q2: ✅ Fase 2 Completa | 🚧 Fase 3 (Backend) | 📋 Fase 4 (Integrações)
├── Q3: ✅ Fase 3 Completa | 🚧 Fase 4 (Integrações) | 📋 Fase 5 (Avançado)
└── Q4: ✅ Fase 4 Completa | 🚧 Fase 5 (Avançado)

2026
└── Q1: ✅ Fase 5 Completa | 🎉 Produto Maduro
```

---

## 🎯 Prioridades Atuais (Novembro 2024)

### Sprint Atual

1. **Dashboard Blazor** (Alta)
   - Migrar dashboard HTML para Blazor
   - Implementar cards de métricas
   - Adicionar gráficos

2. **OrderService Mock** (Alta)
   - Criar service com dados mockados
   - Preparar para integração futura com API

3. **Documentação** (Média)
   - Documentar componentes Blazor criados
   - Atualizar guias de desenvolvimento

### Próximos Sprints

1. **Módulo de Ordens** (Blazor)
2. **Módulo de Clientes** (Blazor)
3. **Início do Backend** (Database + EF Core)

---

## 📝 Notas

### Decisões Pendentes

- **Hosting**: Azure App Service vs AWS vs On-premise?
- **Database**: SQL Server vs PostgreSQL?
- **Mobile**: Flutter vs React Native vs .NET MAUI?
- **Payments**: Stripe vs Mercado Pago vs ambos?

### Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Atraso no backend | Alto | Média | Continuar com mock data no frontend |
| Mudanças de requisitos | Médio | Alta | Protótipos servem como "contrato" |
| Performance do Blazor WASM | Médio | Baixa | Lazy loading, pre-rendering |
| Custos de cloud | Médio | Média | Começar com tier gratuito, escalar gradualmente |

---

## 🤝 Como Contribuir com o Roadmap

Tem sugestões para o roadmap?

1. Abra uma [Discussion](https://github.com/carrijoga/Alvura/discussions) com a tag `roadmap`
2. Descreva a feature/mudança sugerida
3. Justifique a prioridade e impacto
4. Aguarde feedback da equipe

---

## 📚 Recursos

- **Documentação Completa**: [README.md](README.md)
- **Arquitetura**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Setup**: [SETUP.md](SETUP.md)
- **API Spec**: [docs/API.md](docs/API.md)
- **Database**: [docs/DATABASE.md](docs/DATABASE.md)

---

<div align="center">

**Roadmap - Alvura System**

Última atualização: Novembro 2024

[⬆ Voltar ao README](README.md)

</div>
