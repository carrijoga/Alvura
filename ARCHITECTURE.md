# Arquitetura do Sistema Alvura

## Índice

1. [Visão Geral](#visão-geral)
2. [Decisões de Arquitetura](#decisões-de-arquitetura)
3. [Arquitetura Frontend](#arquitetura-frontend)
4. [Arquitetura Backend](#arquitetura-backend-planejada)
5. [Modelo de Dados](#modelo-de-dados)
6. [Fluxos de Dados](#fluxos-de-dados)
7. [Segurança](#segurança)
8. [Escalabilidade](#escalabilidade)
9. [Padrões e Convenções](#padrões-e-convenções)

---

## Visão Geral

### Arquitetura de Alto Nível

```
┌──────────────────────────────────────────────────────────────┐
│                         USUÁRIOS                             │
├──────────────────────────────────────────────────────────────┤
│  🖥️  Desktop    📱 Tablet    📱 Mobile    🤖 Integrações   │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────┐    ┌──────────────────────────┐ │
│  │  Protótipos HTML/JS    │    │   Blazor WebAssembly     │ │
│  │  (docs/)               │    │   (Alvura/)              │ │
│  │                        │    │                          │ │
│  │  • GitHub Pages        │    │  • MudBlazor UI          │ │
│  │  • Validação de UI/UX  │    │  • PWA Support           │ │
│  │  • Demonstração        │    │  • Client-side Routing   │ │
│  │  • Especificação       │    │  • State Management      │ │
│  └────────────────────────┘    └──────────────────────────┘ │
│                                         │                    │
│                                         │ HTTPS/JSON         │
└─────────────────────────────────────────┼────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────┐
│                     CAMADA DE API                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           ASP.NET Core Web API                         │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │ Controllers  │  │ SignalR Hubs │  │   Swagger   │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  │          │                 │                          │ │
│  │          ▼                 ▼                          │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │           Middleware Pipeline                  │  │ │
│  │  │  • Authentication (JWT)                        │  │ │
│  │  │  • Authorization (RBAC)                        │  │ │
│  │  │  • Exception Handling                          │  │ │
│  │  │  • Request Logging                             │  │ │
│  │  │  • CORS                                        │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                  CAMADA DE NEGÓCIOS                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Services                            │ │
│  │                                                        │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │ OrderSvc    │  │ ClientSvc    │  │ InventorySvc │ │ │
│  │  └─────────────┘  └──────────────┘  └──────────────┘ │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │FinancialSvc │  │ ReportSvc    │  │ NotifySvc    │ │ │
│  │  └─────────────┘  └──────────────┘  └──────────────┘ │ │
│  │                                                        │ │
│  │  • Lógica de Negócio                                  │ │
│  │  • Validações de Domínio                              │ │
│  │  • Orquestração de Processos                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                  CAMADA DE DADOS                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Entity Framework Core (ORM)                   │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │            Repositories                          │ │ │
│  │  │                                                  │ │ │
│  │  │  • OrderRepository                               │ │ │
│  │  │  • ClientRepository                              │ │ │
│  │  │  • InventoryRepository                           │ │ │
│  │  │  • FinancialRepository                           │ │ │
│  │  │  • UnitOfWork Pattern                            │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    PERSISTÊNCIA                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  SQL Server    │  │  Redis Cache   │  │  Blob Storage│  │
│  │  (Principal)   │  │  (Sessões)     │  │  (Arquivos)  │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Decisões de Arquitetura

### ADR-001: Arquitetura Dual-Stack (Protótipos + Blazor)

**Status**: Aceito

**Contexto**:
- Necessidade de validar UX/UI rapidamente
- Equipe familiarizada com HTML/CSS/JS
- Desejo de usar tecnologias .NET modernas
- Stakeholders precisam ver progresso visual constante

**Decisão**:
Desenvolver protótipos funcionais completos em HTML/CSS/JS ANTES de iniciar a implementação Blazor.

**Consequências**:
- ✅ **Positivas**:
  - Validação rápida de requisitos
  - Documentação visual viva
  - Deploy imediato para demonstrações
  - Especificação clara para desenvolvimento
  - Desenvolvimento paralelo (frontend/backend)

- ⚠️ **Negativas**:
  - Duplicação temporária de esforço
  - Necessidade de manter sincronização entre protótipos e Blazor
  - Risco de divergência se não gerenciado

**Mitigação**:
- Protótipos congelados após aprovação
- Migração sistemática para Blazor
- Protótipos servem como testes de aceitação visuais

---

### ADR-002: Blazor WebAssembly vs Blazor Server

**Status**: Aceito

**Contexto**:
- Blazor Server: Latência dependente de conexão, menor payload inicial
- Blazor WASM: Aplicação totalmente client-side, PWA nativo, maior payload inicial

**Decisão**:
Usar **Blazor WebAssembly** com Pre-rendering opcional.

**Razões**:
1. **Offline-first**: Lavanderias podem ter conexão instável
2. **PWA Native**: Instalável como app, notificações push
3. **Escalabilidade**: Menor carga no servidor
4. **Latência**: Interface totalmente client-side, sem round-trips
5. **Distribuição**: CDN friendly

**Trade-offs**:
- ⚠️ Payload inicial maior (~2MB)
- ⚠️ SEO limitado (não crítico para app interno)
- ✅ Mitigação: Lazy loading de módulos, Pre-rendering

---

### ADR-003: MudBlazor como UI Library

**Status**: Aceito

**Contexto**:
- Necessidade de componentes UI ricos e responsivos
- Desejo de acelerar desenvolvimento
- Requisito de Material Design

**Decisão**:
Adotar **MudBlazor 8.14.0** como biblioteca principal de componentes.

**Razões**:
1. Componentes Material Design completos
2. Excelente documentação e exemplos
3. Comunidade ativa
4. Temas customizáveis (light/dark)
5. Performance otimizada
6. Sem dependências de JavaScript externo

**Alternativas Consideradas**:
- Blazorise: Menos Material Design focused
- Radzen: Licenciamento comercial
- Ant Design Blazor: Comunidade menor

---

### ADR-004: Repository Pattern + Unit of Work

**Status**: Aceito

**Contexto**:
- Entity Framework Core permite acesso direto via DbContext
- Necessidade de abstrair lógica de acesso a dados
- Facilitar testes unitários

**Decisão**:
Implementar **Repository Pattern** com **Unit of Work**.

**Razões**:
1. Separação de responsabilidades
2. Facilita testes (mocking)
3. Centraliza lógica de queries
4. Permite cache layer
5. Abstrai EF Core (possível troca futura)

**Estrutura**:
```csharp
// Interface genérica
public interface IRepository<T> where T : class
{
    Task<T> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
}

// Unit of Work
public interface IUnitOfWork
{
    IOrderRepository Orders { get; }
    IClientRepository Clients { get; }
    IInventoryRepository Inventory { get; }
    Task<int> CommitAsync();
}
```

---

### ADR-005: SignalR para Real-time Updates

**Status**: Aceito

**Contexto**:
- Múltiplos usuários atualizando ordens simultaneamente
- Necessidade de ver mudanças de status em tempo real
- Notificações de sistema

**Decisão**:
Usar **SignalR** para comunicação real-time.

**Use Cases**:
1. Atualização de status de ordens
2. Notificações de sistema
3. Chat entre operadores (futuro)
4. Alertas de estoque baixo

**Implementação**:
```csharp
// Hub
public class OrderHub : Hub
{
    public async Task OrderStatusChanged(int orderId, string newStatus)
    {
        await Clients.All.SendAsync("ReceiveOrderStatusUpdate", orderId, newStatus);
    }
}

// Cliente Blazor
hubConnection.On<int, string>("ReceiveOrderStatusUpdate", (orderId, status) =>
{
    // Atualizar UI
    InvokeAsync(StateHasChanged);
});
```

---

## Arquitetura Frontend

### Estrutura de Componentes Blazor

```
Alvura/
├── App.razor                          # Root component
├── Program.cs                         # Bootstrap + DI
│
├── Pages/                             # Routable pages
│   ├── Index.razor                    # Dashboard (/)
│   ├── Orders/
│   │   ├── OrderList.razor           # (/orders)
│   │   ├── OrderCreate.razor         # (/orders/create)
│   │   ├── OrderDetails.razor        # (/orders/{id})
│   │   └── OrderEdit.razor           # (/orders/{id}/edit)
│   ├── Clients/
│   ├── Inventory/
│   ├── Financial/
│   ├── Reports/
│   └── Settings/
│
├── Shared/                            # Shared components
│   ├── MainLayout.razor              # Layout principal
│   ├── Layout/
│   │   ├── Navbar/
│   │   │   ├── NavMenu.razor         # Sidebar
│   │   │   ├── NavUpper.razor        # Top bar
│   │   │   ├── UserMenu.razor        # User dropdown
│   │   │   └── Notification.razor    # Notifications
│   │   └── Footer.razor
│   ├── Components/
│   │   ├── StatusBadge.razor         # Badge de status
│   │   ├── Timeline.razor            # Timeline de eventos
│   │   ├── DataTable.razor           # Tabela reutilizável
│   │   └── Charts/
│   │       ├── BarChart.razor
│   │       └── DonutChart.razor
│   └── Dialogs/
│       ├── ConfirmDialog.razor
│       └── StatusUpdateDialog.razor
│
├── Services/                          # Client services
│   ├── IOrderService.cs
│   ├── OrderService.cs
│   ├── IClientService.cs
│   ├── ClientService.cs
│   ├── IAuthService.cs
│   ├── AuthService.cs
│   └── HttpInterceptor.cs           # HTTP interceptor
│
├── Models/                            # DTOs / ViewModels
│   ├── OrderDto.cs
│   ├── ClientDto.cs
│   ├── CreateOrderRequest.cs
│   └── UpdateStatusRequest.cs
│
├── State/                             # State management
│   ├── AppState.cs                   # Global state
│   └── OrderState.cs                 # Feature state
│
└── wwwroot/
    ├── css/
    │   └── app.css                   # Estilos globais
    ├── js/
    │   └── interop.js                # JS interop
    └── manifest.json                 # PWA manifest
```

### State Management

**Abordagem**: Fluxblazor simplificado com serviços Singleton/Scoped

```csharp
// AppState.cs - Estado global da aplicação
public class AppState
{
    private bool _isDarkMode;
    public bool IsDarkMode
    {
        get => _isDarkMode;
        set
        {
            _isDarkMode = value;
            NotifyStateChanged();
        }
    }

    public event Action? OnChange;
    private void NotifyStateChanged() => OnChange?.Invoke();
}

// Injeção no Program.cs
builder.Services.AddSingleton<AppState>();

// Uso em componentes
@inject AppState AppState
@implements IDisposable

protected override void OnInitialized()
{
    AppState.OnChange += StateHasChanged;
}

public void Dispose()
{
    AppState.OnChange -= StateHasChanged;
}
```

---

## Arquitetura Backend (Planejada)

### Estrutura de Projetos

```
Alvura.sln
│
├── Alvura/                           # Frontend Blazor WASM (já existe)
│
├── Alvura.Api/                       # ASP.NET Core Web API
│   ├── Controllers/
│   │   ├── OrdersController.cs
│   │   ├── ClientsController.cs
│   │   ├── InventoryController.cs
│   │   ├── FinancialController.cs
│   │   └── ReportsController.cs
│   ├── Hubs/
│   │   └── OrderHub.cs              # SignalR
│   ├── Middleware/
│   │   ├── ExceptionMiddleware.cs
│   │   └── LoggingMiddleware.cs
│   ├── Program.cs
│   └── appsettings.json
│
├── Alvura.Core/                      # Domínio + Interfaces
│   ├── Entities/
│   │   ├── Order.cs
│   │   ├── OrderItem.cs
│   │   ├── Client.cs
│   │   ├── InventoryItem.cs
│   │   ├── Invoice.cs
│   │   └── User.cs
│   ├── Interfaces/
│   │   ├── IOrderRepository.cs
│   │   ├── IClientRepository.cs
│   │   └── IUnitOfWork.cs
│   ├── Enums/
│   │   ├── OrderStatus.cs
│   │   └── PaymentStatus.cs
│   └── Specifications/              # Specification pattern
│       └── OrderSpecifications.cs
│
├── Alvura.Application/               # Lógica de negócio
│   ├── Services/
│   │   ├── OrderService.cs
│   │   ├── ClientService.cs
│   │   ├── InventoryService.cs
│   │   ├── FinancialService.cs
│   │   └── ReportService.cs
│   ├── DTOs/
│   │   ├── OrderDto.cs
│   │   ├── CreateOrderDto.cs
│   │   └── UpdateOrderDto.cs
│   ├── Mapping/
│   │   └── AutoMapperProfile.cs
│   └── Validators/
│       └── OrderValidator.cs        # FluentValidation
│
├── Alvura.Infrastructure/            # Infraestrutura
│   ├── Data/
│   │   ├── AlvuraDbContext.cs
│   │   ├── Repositories/
│   │   │   ├── OrderRepository.cs
│   │   │   ├── ClientRepository.cs
│   │   │   └── GenericRepository.cs
│   │   └── UnitOfWork.cs
│   ├── Migrations/
│   ├── Identity/
│   │   └── ApplicationUser.cs
│   └── Services/
│       ├── EmailService.cs
│       └── WhatsAppService.cs
│
└── Alvura.Tests/                     # Testes
    ├── Unit/
    ├── Integration/
    └── E2E/
```

### Camadas e Responsabilidades

| Camada | Responsabilidade | Dependências |
|--------|------------------|--------------|
| **Alvura** (Blazor) | Apresentação, UI/UX | Alvura.Application (DTOs) |
| **Alvura.Api** | API REST, SignalR, Auth | Alvura.Application |
| **Alvura.Application** | Lógica de negócio, orquestração | Alvura.Core |
| **Alvura.Core** | Entidades, regras de domínio | Nenhuma |
| **Alvura.Infrastructure** | Acesso a dados, serviços externos | Alvura.Core |

**Regra**: Dependências fluem SEMPRE de fora para dentro (Dependency Inversion Principle)

---

## Modelo de Dados

### Diagrama Entidade-Relacionamento (Principais Entidades)

```
┌─────────────────────┐
│       Client        │
├─────────────────────┤
│ Id (PK)             │
│ Name                │
│ Document (CNPJ)     │
│ Email               │
│ Phone               │
│ Address             │
│ ContactPerson       │
│ IsActive            │
│ CreatedAt           │
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│       Order         │
├─────────────────────┤
│ Id (PK)             │
│ ClientId (FK)       │
│ OrderNumber         │
│ Status              │◄────────┐
│ RequestDate         │         │
│ CollectionDate      │         │
│ DeliveryDate        │         │
│ DriverId (FK)       │         │
│ TotalAmount         │         │
│ Notes               │         │
│ CreatedAt           │         │
│ UpdatedAt           │         │
└─────────────────────┘         │
         │                      │
         │ 1:N                  │
         ▼                      │
┌─────────────────────┐         │
│     OrderItem       │         │
├─────────────────────┤         │
│ Id (PK)             │         │
│ OrderId (FK)        │         │
│ ItemId (FK)         │         │
│ Quantity            │         │
│ UnitPrice           │         │
│ Subtotal            │         │
│ Notes               │         │
└─────────────────────┘         │
         │                      │
         │ N:1                  │
         ▼                      │
┌─────────────────────┐         │
│    ServiceItem      │         │
├─────────────────────┤         │
│ Id (PK)             │         │
│ Name                │         │
│ Description         │         │
│ UnitPrice           │         │
│ Unit                │         │
│ IsActive            │         │
└─────────────────────┘         │
                                │
         ┌──────────────────────┘
         │ 1:N
         ▼
┌─────────────────────┐
│   OrderStatusLog    │
├─────────────────────┤
│ Id (PK)             │
│ OrderId (FK)        │
│ Status              │
│ ChangedAt           │
│ ChangedBy (FK)      │
│ Notes               │
└─────────────────────┘
```

### Entidades Principais

#### Order (Ordem de Serviço)
```csharp
public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } // Ex: OS-2024-001234
    public int ClientId { get; set; }
    public Client Client { get; set; }

    public OrderStatus Status { get; set; }
    public DateTime RequestDate { get; set; }
    public DateTime? CollectionDate { get; set; }
    public DateTime? DeliveryDate { get; set; }

    public int? DriverId { get; set; }
    public User? Driver { get; set; }

    public decimal TotalAmount { get; set; }
    public string? Notes { get; set; }

    public ICollection<OrderItem> Items { get; set; }
    public ICollection<OrderStatusLog> StatusHistory { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CreatedBy { get; set; }
}

public enum OrderStatus
{
    Requested = 1,      // Solicitado
    Collected = 2,      // Coletado
    InWashing = 3,      // Em Lavagem
    Drying = 4,         // Secagem
    Ironing = 5,        // Passadoria
    Packed = 6,         // Embalado
    Ready = 7,          // Pronto
    InRoute = 8,        // Em Rota
    Delivered = 9,      // Entregue
    Cancelled = 99      // Cancelado
}
```

Veja especificação completa do banco em [docs/DATABASE.md](docs/DATABASE.md)

---

## Fluxos de Dados

### Fluxo: Criar Ordem de Serviço

```
┌──────────┐         ┌─────────────┐         ┌──────────┐         ┌──────────┐
│  Blazor  │────1───▶│  OrderSvc   │────2───▶│   API    │────3───▶│    DB    │
│   WASM   │         │  (Client)   │         │ OrderCtrl│         │  SQL     │
└──────────┘         └─────────────┘         └──────────┘         └──────────┘
     │                      │                       │                    │
     │  HTTP POST           │                       │                    │
     │  /api/orders         │                       │                    │
     │  + CreateOrderDto    │                       │                    │
     ├──────────────────────▶                       │                    │
     │                      │  HttpClient.PostAsync │                    │
     │                      ├───────────────────────▶                    │
     │                      │                       │  Validate DTO      │
     │                      │                       ├─────┐              │
     │                      │                       │     │              │
     │                      │                       │◄────┘              │
     │                      │                       │  Call Service      │
     │                      │                       │  OrderService      │
     │                      │                       │  .CreateAsync()    │
     │                      │                       ├─────┐              │
     │                      │                       │     │              │
     │                      │                       │◄────┘              │
     │                      │                       │  Map DTO→Entity    │
     │                      │                       ├─────┐              │
     │                      │                       │     │              │
     │                      │                       │◄────┘              │
     │                      │                       │  Repository.Add()  │
     │                      │                       ├────────────────────▶
     │                      │                       │                    │
     │                      │                       │  UnitOfWork.Commit()
     │                      │                       ├────────────────────▶
     │                      │                       │                    │
     │                      │                       │◄───────────────────┤
     │                      │                       │  Return Entity     │
     │                      │◄──────────────────────┤                    │
     │                      │  200 OK + OrderDto    │                    │
     │◄─────────────────────┤                       │                    │
     │  OrderDto            │                       │                    │
     │                      │                       │                    │
     ├──SignalR Notification────────────────────────▶                    │
     │  "OrderCreated"      │                       │                    │
     │                      │                       │                    │
     ▼                      ▼                       ▼                    ▼
 Navigate to              Update                  Broadcast           Transaction
 OrderDetails             Local State             to Connected        Committed
                                                  Clients
```

### Validações em Camadas

| Camada | Tipo de Validação | Tecnologia |
|--------|-------------------|------------|
| **Cliente (Blazor)** | Formato, obrigatoriedade, ranges | Data Annotations + MudBlazor |
| **API (Controller)** | Validação de DTOs | FluentValidation |
| **Negócio (Service)** | Regras de domínio | Custom logic |
| **Dados (Repository)** | Constraints de DB | EF Core Validations |

---

## Segurança

### Autenticação JWT

```csharp
// Fluxo de Login
1. POST /api/auth/login { email, password }
2. API valida credenciais (ASP.NET Identity)
3. API gera JWT token
4. Cliente armazena token (LocalStorage/SessionStorage)
5. Cliente inclui token em todas requests: Authorization: Bearer {token}
6. API valida token em cada request (middleware)
```

**Estrutura do Token**:
```json
{
  "sub": "user@example.com",
  "jti": "unique-token-id",
  "iat": 1699999999,
  "exp": 1700086399,
  "roles": ["Operator", "Manager"],
  "clientId": "123"
}
```

### Autorização RBAC (Role-Based Access Control)

**Roles**:
- **Admin**: Acesso total
- **Manager**: Gerenciar ordens, clientes, estoque, relatórios
- **Operator**: Criar e atualizar ordens
- **Driver**: Ver ordens atribuídas, atualizar status de entrega
- **Client**: Portal cliente (somente leitura de suas ordens)

**Implementação**:
```csharp
[Authorize(Roles = "Admin,Manager")]
[HttpDelete("/api/orders/{id}")]
public async Task<IActionResult> DeleteOrder(int id)
{
    // ...
}

[Authorize(Policy = "CanManageOrders")]
[HttpPut("/api/orders/{id}/status")]
public async Task<IActionResult> UpdateStatus(int id, UpdateStatusDto dto)
{
    // ...
}
```

### Proteções Implementadas

- ✅ **HTTPS**: Obrigatório em produção
- ✅ **CORS**: Whitelist de origens permitidas
- ✅ **Rate Limiting**: Proteção contra DDoS
- ✅ **Input Validation**: Todas as camadas
- ✅ **SQL Injection**: EF Core (parameterized queries)
- ✅ **XSS**: Blazor sanitiza automaticamente
- ✅ **CSRF**: Tokens de validação

---

## Escalabilidade

### Estratégias de Caching

```csharp
// 1. Distributed Cache (Redis)
services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost:6379";
});

// 2. In-Memory Cache (curto prazo)
services.AddMemoryCache();

// 3. Output Cache (API responses)
[ResponseCache(Duration = 60)]
[HttpGet("/api/items")]
public async Task<IActionResult> GetServiceItems() { }
```

**O que cachear**:
- ✅ Itens de serviço (raro mudar)
- ✅ Clientes ativos (TTL: 5 min)
- ✅ Configurações do sistema
- ❌ Ordens (mudam frequentemente)
- ❌ Status em tempo real

### Database Optimization

```csharp
// Índices recomendados
CREATE INDEX IX_Orders_ClientId ON Orders(ClientId);
CREATE INDEX IX_Orders_Status ON Orders(Status);
CREATE INDEX IX_Orders_CollectionDate ON Orders(CollectionDate);
CREATE INDEX IX_Orders_DeliveryDate ON Orders(DeliveryDate);
CREATE INDEX IX_OrderStatusLog_OrderId ON OrderStatusLog(OrderId);

// Queries otimizadas
context.Orders
    .Include(o => o.Client)              // Eager loading
    .Include(o => o.Items)
    .ThenInclude(i => i.ServiceItem)
    .AsNoTracking()                       // Read-only, mais rápido
    .Where(o => o.Status != OrderStatus.Delivered)
    .ToListAsync();
```

### Horizontal Scaling

```
                    ┌──────────────┐
                    │ Load Balancer│
                    └───────┬──────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐     ┌──────────┐
    │ API #1   │      │ API #2   │     │ API #3   │
    └──────────┘      └──────────┘     └──────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                    ┌───────▼──────┐
                    │ SQL Server   │
                    │ (Read Replica)│
                    └──────────────┘
```

---

## Padrões e Convenções

### Clean Code Principles

- **SOLID**: Aplicado em todas as camadas
- **DRY**: Não repita código
- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Aren't Gonna Need It

### Naming Conventions

```csharp
// Classes: PascalCase
public class OrderService { }

// Interfaces: I + PascalCase
public interface IOrderService { }

// Métodos: PascalCase
public async Task<Order> GetByIdAsync(int id) { }

// Variáveis/Parâmetros: camelCase
var orderDto = new OrderDto();

// Constantes: PascalCase
public const int MaxItemsPerOrder = 100;

// Private fields: _camelCase
private readonly IOrderRepository _orderRepository;
```

### Async/Await Best Practices

```csharp
// ✅ CORRETO
public async Task<Order> GetOrderAsync(int id)
{
    return await _repository.GetByIdAsync(id);
}

// ❌ ERRADO (async sem await)
public async Task<Order> GetOrder(int id)
{
    return _repository.GetById(id); // Não use async se não tem await
}

// ✅ CORRETO (sufixo Async)
public async Task<List<Order>> GetAllOrdersAsync()
{
    return await _repository.GetAllAsync();
}
```

### Exception Handling

```csharp
// Global exception middleware
app.UseMiddleware<ExceptionMiddleware>();

public class ExceptionMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (NotFoundException ex)
        {
            context.Response.StatusCode = 404;
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
        }
        catch (ValidationException ex)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new { errors = ex.Errors });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new { error = "Internal server error" });
        }
    }
}
```

---

## Monitoramento e Logs

### Application Insights (Planejado)

```csharp
services.AddApplicationInsightsTelemetry();

// Custom telemetry
_telemetryClient.TrackEvent("OrderCreated", new Dictionary<string, string>
{
    { "OrderId", order.Id.ToString() },
    { "ClientId", order.ClientId.ToString() }
});
```

### Serilog (Structured Logging)

```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("logs/alvura-.log", rollingInterval: RollingInterval.Day)
    .WriteTo.Seq("http://localhost:5341")
    .CreateLogger();

_logger.LogInformation("Order {OrderId} created by {User}", order.Id, user.Email);
```

---

## Próximos Passos Arquiteturais

### Fase Imediata
- [ ] Implementar API REST básica
- [ ] Configurar Entity Framework + Migrations
- [ ] Implementar JWT Authentication
- [ ] Configurar SignalR

### Médio Prazo
- [ ] Adicionar Redis para cache distribuído
- [ ] Implementar API Gateway (Ocelot/YARP)
- [ ] Configurar health checks
- [ ] Adicionar telemetria (Application Insights)

### Longo Prazo
- [ ] Microserviços (se necessário)
- [ ] Event Sourcing para auditoria
- [ ] CQRS para relatórios complexos
- [ ] Kubernetes para orquestração

---

## Referências

- [Blazor Documentation](https://docs.microsoft.com/aspnet/core/blazor/)
- [MudBlazor](https://mudblazor.com/getting-started/installation)
- [Clean Architecture - Jason Taylor](https://github.com/jasontaylordev/CleanArchitecture)
- [ASP.NET Core Best Practices](https://docs.microsoft.com/aspnet/core/fundamentals/best-practices)
- [Entity Framework Core Performance](https://docs.microsoft.com/ef/core/performance/)

---

<div align="center">

**Documentação de Arquitetura - Alvura System**

[⬆ Voltar ao README](README.md)

</div>
