# Guia de Setup e Desenvolvimento - Alvura

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação](#instalação)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Executando o Projeto](#executando-o-projeto)
5. [Estrutura de Desenvolvimento](#estrutura-de-desenvolvimento)
6. [Workflows de Desenvolvimento](#workflows-de-desenvolvimento)
7. [Troubleshooting](#troubleshooting)
8. [Ferramentas Recomendadas](#ferramentas-recomendadas)

---

## Pré-requisitos

### Obrigatórios

#### 1. .NET 10 SDK
```bash
# Verificar instalação
dotnet --version
# Deve retornar: 10.0.x ou superior

# Download: https://dotnet.microsoft.com/download/dotnet/10.0
```

**Instalação por Plataforma**:

**Windows**:
- Baixe o instalador em [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
- Execute o instalador
- Reinicie o terminal

**macOS** (via Homebrew):
```bash
brew install --cask dotnet-sdk
```

**Linux** (Ubuntu/Debian):
```bash
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 10.0
```

#### 2. Git
```bash
# Verificar instalação
git --version

# Download: https://git-scm.com/downloads
```

### Opcionais (mas recomendados)

#### 3. IDEs

**Visual Studio 2022** (Windows/Mac)
- Download: https://visualstudio.microsoft.com/
- Workloads necessários:
  - ASP.NET and web development
  - .NET desktop development

**VS Code** (Multiplataforma)
- Download: https://code.visualstudio.com/
- Extensões recomendadas:
  - C# Dev Kit (Microsoft)
  - Blazor WASM Debugging (George Olivier)
  - GitLens (GitKraken)
  - REST Client (Huachao Mao)

**Rider** (JetBrains)
- Download: https://www.jetbrains.com/rider/
- Suporte excelente para Blazor e .NET

#### 4. Node.js (para protótipos HTML)
```bash
# Verificar instalação
node --version
npm --version

# Download: https://nodejs.org/ (versão LTS 18+)
```

#### 5. SQL Server (Backend - planejado)

**Windows**:
- SQL Server 2019 Express: https://www.microsoft.com/sql-server/sql-server-downloads
- SQL Server Management Studio (SSMS): https://aka.ms/ssmsfullsetup

**macOS/Linux**:
- Docker com SQL Server:
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sql_server \
   -d mcr.microsoft.com/mssql/server:2019-latest
```

#### 6. Redis (Caching - planejado)
```bash
# Via Docker
docker run -d -p 6379:6379 --name redis redis:alpine
```

---

## Instalação

### 1. Clone o Repositório

```bash
# Via HTTPS
git clone https://github.com/carrijoga/Alvura.git
cd Alvura

# Ou via SSH
git clone git@github.com:carrijoga/Alvura.git
cd Alvura
```

### 2. Restaurar Dependências do Blazor

```bash
cd Alvura
dotnet restore
```

**Saída esperada**:
```
Determining projects to restore...
Restored /path/to/Alvura/Alvura.csproj (in X ms).
```

### 3. Build do Projeto

```bash
dotnet build
```

**Saída esperada**:
```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

---

## Configuração do Ambiente

### 1. Protótipos HTML (GitHub Pages)

Os protótipos já estão publicados em: https://alvura.carrijoga.com.br

**Para executar localmente**:

```bash
cd docs

# Opção 1: Servidor HTTP simples (Python)
python -m http.server 8000
# Acesse: http://localhost:8000

# Opção 2: Live Server (VS Code)
# Instale a extensão "Live Server"
# Clique com botão direito em index.html > "Open with Live Server"

# Opção 3: Node.js http-server
npm install -g http-server
http-server -p 8000
```

### 2. Aplicação Blazor WebAssembly

#### Configuração de Desenvolvimento

Edite `Alvura/Alvura.csproj` se necessário:

```xml
<Project Sdk="Microsoft.NET.Sdk.BlazorWebAssembly">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <ServiceWorkerAssetsManifest>service-worker-assets.js</ServiceWorkerAssetsManifest>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Components.WebAssembly" Version="10.0.*" />
    <PackageReference Include="Microsoft.AspNetCore.Components.WebAssembly.DevServer" Version="10.0.*" PrivateAssets="all" />
    <PackageReference Include="MudBlazor" Version="8.14.0" />
  </ItemGroup>
</Project>
```

#### Variáveis de Ambiente

Crie `Alvura/wwwroot/appsettings.Development.json`:

```json
{
  "ApiBaseUrl": "https://localhost:5001",
  "EnableDetailedErrors": true,
  "EnableDetailedBlazorErrors": true
}
```

Crie `Alvura/wwwroot/appsettings.Production.json`:

```json
{
  "ApiBaseUrl": "https://api.alvura.com.br",
  "EnableDetailedErrors": false,
  "EnableDetailedBlazorErrors": false
}
```

### 3. Backend API (Quando Implementado)

#### Connection Strings

Edite `Alvura.Api/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=AlvuraDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-change-in-production",
    "Issuer": "https://localhost:5001",
    "Audience": "https://localhost:5001",
    "ExpirationMinutes": 60
  },
  "Redis": {
    "Configuration": "localhost:6379"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

#### Criar Banco de Dados

```bash
# Quando a API estiver implementada
cd Alvura.Api
dotnet ef database update

# Ou via script SQL
sqlcmd -S localhost -U sa -P YourStrong@Passw0rd -i scripts/create-database.sql
```

---

## Executando o Projeto

### Modo 1: Protótipos HTML (Standalone)

```bash
cd docs
python -m http.server 8000

# Abra o navegador em http://localhost:8000
```

**Funcionalidades disponíveis**:
- Dashboard com gráficos
- Lista de ordens com filtros
- Criar nova ordem
- Detalhes da ordem com timeline
- Gestão de clientes
- Controle de estoque
- Gestão financeira
- Relatórios

### Modo 2: Aplicação Blazor (Desenvolvimento)

```bash
cd Alvura
dotnet run

# Ou com hot reload
dotnet watch
```

**Saída esperada**:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

Acesse: https://localhost:5001

**Hot Reload ativo**:
- Edite qualquer arquivo `.razor`, `.cs`, `.css`
- Salve o arquivo
- O navegador recarrega automaticamente

### Modo 3: Blazor + API (Futuro)

**Terminal 1 - API**:
```bash
cd Alvura.Api
dotnet watch
# Rodando em: https://localhost:5001
```

**Terminal 2 - Blazor**:
```bash
cd Alvura
dotnet watch
# Rodando em: https://localhost:5002
```

### Modo 4: Docker Compose (Futuro)

```bash
docker-compose up -d

# Serviços disponíveis:
# - Blazor WASM: http://localhost:8080
# - API: http://localhost:5000
# - SQL Server: localhost:1433
# - Redis: localhost:6379
```

---

## Estrutura de Desenvolvimento

### Branch Strategy (Git Flow Simplificado)

```
main (produção)
  │
  ├── develop (desenvolvimento)
  │     │
  │     ├── feature/dashboard-module
  │     ├── feature/orders-module
  │     ├── feature/clients-module
  │     └── bugfix/fix-order-validation
  │
  └── hotfix/critical-security-fix
```

**Comandos**:

```bash
# Criar branch de feature
git checkout develop
git checkout -b feature/new-feature-name

# Trabalhar na feature
git add .
git commit -m "feat: Add new feature"

# Atualizar com develop
git fetch origin
git rebase origin/develop

# Merge na develop (via Pull Request)
git checkout develop
git merge feature/new-feature-name
git push origin develop
```

### Conventional Commits

```bash
# Formato
<type>(<scope>): <description>

[optional body]

[optional footer]

# Tipos
feat:      Nova funcionalidade
fix:       Correção de bug
docs:      Documentação
style:     Formatação (não afeta código)
refactor:  Refatoração
test:      Adicionar testes
chore:     Manutenção

# Exemplos
git commit -m "feat(orders): Add order creation form"
git commit -m "fix(dashboard): Fix chart rendering issue"
git commit -m "docs(readme): Update installation instructions"
```

### Code Style

#### C# (EditorConfig)

Crie `.editorconfig` na raiz:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 4
trim_trailing_whitespace = true

[*.{cs,razor}]
indent_size = 4

[*.{js,css,html,json}]
indent_size = 2

# C# Conventions
[*.cs]
csharp_new_line_before_open_brace = all
csharp_indent_case_contents = true
csharp_prefer_braces = true:warning
dotnet_sort_system_directives_first = true
dotnet_style_qualification_for_field = false:warning
dotnet_style_qualification_for_property = false:warning
```

#### Blazor Components

**Estrutura recomendada**:

```razor
@page "/orders"
@inject IOrderService OrderService
@inject NavigationManager Navigation

<PageTitle>Ordens de Serviço - Alvura</PageTitle>

<MudContainer MaxWidth="MaxWidth.ExtraLarge" Class="mt-4">
    <MudText Typo="Typo.h4" Class="mb-4">Ordens de Serviço</MudText>

    @if (orders == null)
    {
        <MudProgressCircular Indeterminate="true" />
    }
    else
    {
        <MudTable Items="@orders" Hover="true">
            <!-- Table content -->
        </MudTable>
    }
</MudContainer>

@code {
    private List<OrderDto>? orders;

    protected override async Task OnInitializedAsync()
    {
        orders = await OrderService.GetAllAsync();
    }

    private void NavigateToDetails(int id)
    {
        Navigation.NavigateTo($"/orders/{id}");
    }
}
```

---

## Workflows de Desenvolvimento

### Workflow 1: Adicionar Nova Página Blazor

1. **Criar arquivo .razor**:
```bash
# Alvura/Pages/Orders/OrderList.razor
touch Alvura/Pages/Orders/OrderList.razor
```

2. **Implementar componente**:
```razor
@page "/orders"
@inject IOrderService OrderService

<PageTitle>Ordens - Alvura</PageTitle>

<h3>Lista de Ordens</h3>

@code {
    private List<OrderDto>? orders;

    protected override async Task OnInitializedAsync()
    {
        orders = await OrderService.GetAllAsync();
    }
}
```

3. **Adicionar ao menu** (`Shared/Layout/Navbar/NavMenu.razor`):
```razor
<MudNavLink Href="/orders" Icon="@Icons.Material.Filled.Receipt">
    Ordens
</MudNavLink>
```

4. **Testar**:
```bash
dotnet watch
```

### Workflow 2: Adicionar Novo Serviço

1. **Criar interface** (`Services/IOrderService.cs`):
```csharp
public interface IOrderService
{
    Task<List<OrderDto>> GetAllAsync();
    Task<OrderDto> GetByIdAsync(int id);
    Task<OrderDto> CreateAsync(CreateOrderDto dto);
    Task UpdateAsync(int id, UpdateOrderDto dto);
    Task DeleteAsync(int id);
}
```

2. **Implementar serviço** (`Services/OrderService.cs`):
```csharp
public class OrderService : IOrderService
{
    private readonly HttpClient _httpClient;

    public OrderService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<OrderDto>> GetAllAsync()
    {
        return await _httpClient.GetFromJsonAsync<List<OrderDto>>("api/orders")
            ?? new List<OrderDto>();
    }

    // Implementar outros métodos...
}
```

3. **Registrar no DI** (`Program.cs`):
```csharp
builder.Services.AddScoped<IOrderService, OrderService>();
```

### Workflow 3: Atualizar Protótipo HTML

1. **Editar HTML**:
```bash
code docs/ordens.html
```

2. **Testar localmente**:
```bash
cd docs
python -m http.server 8000
```

3. **Commit e push**:
```bash
git add docs/
git commit -m "feat(prototypes): Update orders list UI"
git push origin main
```

4. **GitHub Pages atualiza automaticamente** em ~2 minutos

---

## Troubleshooting

### Problema: Erro ao restaurar pacotes NuGet

**Sintoma**:
```
error NU1101: Unable to find package MudBlazor
```

**Solução**:
```bash
# Limpar cache do NuGet
dotnet nuget locals all --clear

# Restaurar novamente
dotnet restore
```

### Problema: Hot Reload não funciona

**Sintoma**: Mudanças no código não refletem no navegador

**Solução**:
```bash
# 1. Limpar build
dotnet clean

# 2. Rebuild
dotnet build

# 3. Executar com watch
dotnet watch

# 4. Se persistir, limpar cache do navegador (Ctrl+Shift+Delete)
```

### Problema: Erro CORS ao chamar API

**Sintoma**:
```
Access to fetch at 'https://localhost:5001/api/orders' from origin 'https://localhost:5002' has been blocked by CORS policy
```

**Solução** (API - `Program.cs`):
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowBlazor", policy =>
    {
        policy.WithOrigins("https://localhost:5002")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

app.UseCors("AllowBlazor");
```

### Problema: SQL Server não conecta (Docker)

**Sintoma**:
```
A connection was successfully established with the server, but then an error occurred during the login process.
```

**Solução**:
```bash
# Verificar se container está rodando
docker ps | grep sql_server

# Ver logs
docker logs sql_server

# Reiniciar container
docker restart sql_server

# Testar conexão
sqlcmd -S localhost -U sa -P YourStrong@Passw0rd -Q "SELECT @@VERSION"
```

### Problema: Blazor lento em Development

**Sintoma**: Aplicação carrega muito lentamente

**Causa**: Modo Debug + símbolos de debug

**Solução**:
```bash
# Executar em modo Release
dotnet run --configuration Release

# Ou desabilitar debug
# Em launchSettings.json:
"ASPNETCORE_ENVIRONMENT": "Production"
```

### Problema: Erro "Cannot find module '@microsoft/signalr'"

**Sintoma**: SignalR não funciona no Blazor

**Solução**:
```bash
# Instalar pacote JavaScript
cd Alvura/wwwroot
npm install @microsoft/signalr

# Ou usar CDN no index.html
<script src="https://cdn.jsdelivr.net/npm/@microsoft/signalr@latest/dist/browser/signalr.min.js"></script>
```

---

## Ferramentas Recomendadas

### Desenvolvimento

| Ferramenta | Propósito | Link |
|------------|-----------|------|
| **Postman** | Testar APIs | https://www.postman.com/ |
| **Insomnia** | Alternativa ao Postman | https://insomnia.rest/ |
| **DB Browser for SQLite** | Visualizar DBs SQLite | https://sqlitebrowser.org/ |
| **Azure Data Studio** | Cliente SQL Server (cross-platform) | https://aka.ms/azuredatastudio |
| **Redis Commander** | GUI para Redis | `npm install -g redis-commander` |

### DevOps

| Ferramenta | Propósito | Link |
|------------|-----------|------|
| **Docker Desktop** | Containerização | https://www.docker.com/products/docker-desktop |
| **GitHub Desktop** | Git GUI | https://desktop.github.com/ |
| **GitKraken** | Git GUI avançado | https://www.gitkraken.com/ |

### Extensões VS Code

```bash
# Instalar via CLI
code --install-extension ms-dotnettools.csharp
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension eamodio.gitlens
code --install-extension humao.rest-client
```

### Utilitários CLI

```bash
# .NET Global Tools
dotnet tool install --global dotnet-ef              # EF Core CLI
dotnet tool install --global dotnet-outdated        # Verificar pacotes desatualizados
dotnet tool install --global dotnet-format          # Formatação de código
dotnet tool install --global dotnet-reportgenerator # Relatórios de cobertura
```

---

## Scripts Úteis

### build.sh (Linux/Mac)

```bash
#!/bin/bash
echo "🔨 Building Alvura..."
dotnet clean
dotnet restore
dotnet build --configuration Release
echo "✅ Build completed!"
```

### build.bat (Windows)

```batch
@echo off
echo Building Alvura...
dotnet clean
dotnet restore
dotnet build --configuration Release
echo Build completed!
```

### deploy-prototypes.sh

```bash
#!/bin/bash
echo "🚀 Deploying prototypes to GitHub Pages..."
cd docs
git add .
git commit -m "chore: Update prototypes"
git push origin main
echo "✅ Deployed! Check https://alvura.carrijoga.com.br in ~2 minutes"
```

---

## Próximos Passos

Após configurar o ambiente:

1. ✅ Explore os protótipos HTML em https://alvura.carrijoga.com.br
2. ✅ Execute a aplicação Blazor localmente
3. 📖 Leia [ARCHITECTURE.md](ARCHITECTURE.md) para entender a arquitetura
4. 🎯 Veja [ROADMAP.md](ROADMAP.md) para entender o planejamento
5. 🤝 Leia [CONTRIBUTING.md](CONTRIBUTING.md) antes de contribuir

---

## Suporte

Problemas não listados aqui?

- Abra uma issue: https://github.com/carrijoga/Alvura/issues
- Consulte a documentação: [README.md](README.md)

---

<div align="center">

**Guia de Setup - Alvura System**

[⬆ Voltar ao README](README.md)

</div>
