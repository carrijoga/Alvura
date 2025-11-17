# Guia de Contribuição - Alvura

Obrigado por considerar contribuir com o Alvura! Este documento fornece diretrizes para contribuições ao projeto.

## 📋 Índice

1. [Código de Conduta](#código-de-conduta)
2. [Como Posso Contribuir?](#como-posso-contribuir)
3. [Processo de Desenvolvimento](#processo-de-desenvolvimento)
4. [Padrões de Código](#padrões-de-código)
5. [Commits e Pull Requests](#commits-e-pull-requests)
6. [Reportando Bugs](#reportando-bugs)
7. [Sugerindo Melhorias](#sugerindo-melhorias)

---

## Código de Conduta

### Nosso Compromisso

Estamos comprometidos em proporcionar um ambiente acolhedor e inclusivo para todos, independentemente de experiência, identidade de gênero, orientação sexual, deficiência, aparência, raça, etnia, idade, religião ou nacionalidade.

### Comportamentos Esperados

- Use linguagem acolhedora e inclusiva
- Respeite pontos de vista e experiências diferentes
- Aceite críticas construtivas com graça
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros da comunidade

### Comportamentos Inaceitáveis

- Uso de linguagem ou imagens sexualizadas
- Comentários insultuosos ou depreciativos (trolling)
- Assédio público ou privado
- Publicação de informações privadas de terceiros
- Conduta não profissional

---

## Como Posso Contribuir?

### 1. Reportar Bugs

Encontrou um bug? Siga estas etapas:

1. **Verifique se já foi reportado**: Procure em [Issues existentes](https://github.com/carrijoga/Alvura/issues)
2. **Crie uma nova issue**: Use o template de bug report
3. **Forneça detalhes**: Inclua:
   - Versão do sistema operacional
   - Versão do .NET
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Logs de erro

**Template de Bug Report**:

```markdown
**Descrição do Bug**
Uma descrição clara do problema.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

**Comportamento Esperado**
O que você esperava que acontecesse.

**Comportamento Atual**
O que realmente aconteceu.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente**
- OS: [ex: Windows 11]
- .NET: [ex: 10.0.0]
- Browser: [ex: Chrome 120]

**Informações Adicionais**
Qualquer outro contexto relevante.
```

---

### 2. Sugerir Melhorias

Tem uma ideia para melhorar o Alvura?

1. **Verifique se já foi sugerida**: Procure em Issues/Discussions
2. **Crie uma Feature Request**: Use o template
3. **Descreva o problema**: Qual problema isso resolve?
4. **Descreva a solução**: Como você imagina que funcione?
5. **Considere alternativas**: Quais outras abordagens você considerou?

**Template de Feature Request**:

```markdown
**Problema a Resolver**
Uma descrição clara do problema que a feature resolve.

**Solução Proposta**
Uma descrição clara da solução que você imagina.

**Alternativas Consideradas**
Outras abordagens que você pensou.

**Impacto**
- Usuários beneficiados: [ex: todos, apenas admins]
- Prioridade sugerida: [Baixa / Média / Alta / Crítica]

**Contexto Adicional**
Screenshots, mockups, exemplos de outros sistemas.
```

---

### 3. Contribuir com Código

#### Tipos de Contribuição

- **Correção de bugs**: Issues marcadas com `bug`
- **Novas funcionalidades**: Issues marcadas com `enhancement`
- **Documentação**: Melhorias em docs
- **Testes**: Aumentar cobertura de testes
- **Refatoração**: Melhorar código existente

#### Para Iniciantes

Procure issues marcadas com:
- `good first issue`: Ótimo para começar
- `help wanted`: Precisamos de ajuda aqui

---

## Processo de Desenvolvimento

### 1. Fork e Clone

```bash
# Fork no GitHub (botão "Fork" no repositório)

# Clone seu fork
git clone https://github.com/SEU_USERNAME/Alvura.git
cd Alvura

# Adicione o repositório original como upstream
git remote add upstream https://github.com/carrijoga/Alvura.git
```

### 2. Crie uma Branch

```bash
# Atualize sua main
git checkout main
git pull upstream main

# Crie uma branch para sua feature/bugfix
git checkout -b feature/nome-da-feature
# ou
git checkout -b bugfix/nome-do-bug
```

**Convenções de nomenclatura**:
- `feature/`: Nova funcionalidade
- `bugfix/`: Correção de bug
- `docs/`: Mudanças na documentação
- `refactor/`: Refatoração
- `test/`: Adição de testes

### 3. Faça suas Mudanças

```bash
# Edite os arquivos
code .

# Teste localmente
dotnet build
dotnet test
dotnet run
```

### 4. Commit suas Mudanças

```bash
git add .
git commit -m "feat: Adiciona nova funcionalidade X"
```

Veja [Commits e Pull Requests](#commits-e-pull-requests) para convenções.

### 5. Push para seu Fork

```bash
git push origin feature/nome-da-feature
```

### 6. Abra um Pull Request

1. Vá para seu fork no GitHub
2. Clique em "Compare & pull request"
3. Preencha o template de PR
4. Marque a issue relacionada (ex: `Closes #123`)
5. Aguarde review

---

## Padrões de Código

### C# / Blazor

#### Convenções de Nomenclatura

```csharp
// Classes e interfaces: PascalCase
public class OrderService { }
public interface IOrderService { }

// Métodos: PascalCase
public async Task<Order> GetByIdAsync(int id) { }

// Variáveis locais e parâmetros: camelCase
var orderDto = new OrderDto();
public void ProcessOrder(int orderId) { }

// Constantes: PascalCase
public const int MaxItemsPerOrder = 100;

// Private fields: _camelCase
private readonly IOrderRepository _orderRepository;

// Propriedades: PascalCase
public string OrderNumber { get; set; }
```

#### Estilo de Código

```csharp
// ✅ BOM: Usar var quando tipo é óbvio
var order = new Order();
var orders = await _repository.GetAllAsync();

// ❌ RUIM: Não usar var quando tipo não é óbvio
var result = ProcessData(); // Que tipo é result?

// ✅ BOM: Async/await
public async Task<Order> GetOrderAsync(int id)
{
    return await _repository.GetByIdAsync(id);
}

// ❌ RUIM: Async sem await
public async Task<Order> GetOrder(int id)
{
    return _repository.GetById(id);
}

// ✅ BOM: Null checks com pattern matching
if (order is null)
    throw new NotFoundException("Ordem não encontrada");

// ✅ BOM: LINQ legível
var activeOrders = orders
    .Where(o => o.Status != OrderStatus.Cancelled)
    .OrderByDescending(o => o.CreatedAt)
    .ToList();
```

#### Componentes Blazor

```razor
@* ✅ BOM: Estrutura clara *@
@page "/orders"
@inject IOrderService OrderService
@inject NavigationManager Navigation

<PageTitle>Ordens - Alvura</PageTitle>

<MudContainer MaxWidth="MaxWidth.ExtraLarge">
    <MudText Typo="Typo.h4">Ordens de Serviço</MudText>

    @if (orders == null)
    {
        <MudProgressCircular />
    }
    else
    {
        <MudTable Items="@orders" />
    }
</MudContainer>

@code {
    private List<OrderDto>? orders;

    protected override async Task OnInitializedAsync()
    {
        orders = await OrderService.GetAllAsync();
    }
}
```

### HTML/CSS/JS (Protótipos)

```html
<!-- ✅ BOM: HTML semântico -->
<header>
  <nav>
    <ul>
      <li><a href="/">Dashboard</a></li>
    </ul>
  </nav>
</header>

<!-- ❌ RUIM: Divs sem significado -->
<div class="header">
  <div class="nav">
    <div class="item">Dashboard</div>
  </div>
</div>
```

```css
/* ✅ BOM: Classes descritivas */
.order-card {
  padding: 1rem;
  border-radius: 8px;
}

/* ❌ RUIM: Classes crípticas */
.oc1 {
  padding: 1rem;
}
```

```javascript
// ✅ BOM: Funções descritivas
function fetchOrders() {
  return fetch('/api/orders').then(res => res.json());
}

// ❌ RUIM: Nomes genéricos
function getData() {
  return fetch('/api/orders').then(res => res.json());
}
```

---

## Commits e Pull Requests

### Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat(orders): Add order creation form` |
| `fix` | Correção de bug | `fix(dashboard): Fix chart rendering` |
| `docs` | Documentação | `docs(readme): Update setup instructions` |
| `style` | Formatação | `style(orders): Format code with prettier` |
| `refactor` | Refatoração | `refactor(services): Extract common logic` |
| `test` | Testes | `test(orders): Add unit tests for OrderService` |
| `chore` | Manutenção | `chore(deps): Update MudBlazor to 8.14.0` |
| `perf` | Performance | `perf(api): Add caching to orders endpoint` |

#### Exemplos

```bash
# Feature
git commit -m "feat(orders): Add status timeline component"

# Bug fix
git commit -m "fix(dashboard): Fix date range selector not updating charts"

# Documentação
git commit -m "docs(api): Add authentication examples"

# Breaking change
git commit -m "feat(api): Change order status enum values

BREAKING CHANGE: Status 'Pending' renamed to 'Requested'"
```

### Pull Request Guidelines

#### Antes de Submeter

- [ ] Código compila sem erros
- [ ] Testes passam (`dotnet test`)
- [ ] Código segue os padrões do projeto
- [ ] Documentação atualizada (se necessário)
- [ ] Commits seguem Conventional Commits
- [ ] Branch está atualizada com main

#### Template de Pull Request

```markdown
## Descrição

Uma descrição clara do que este PR faz.

## Tipo de Mudança

- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova funcionalidade (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação

## Como Testar

1. Vá para '...'
2. Clique em '...'
3. Veja '...'

## Checklist

- [ ] Meu código segue os padrões do projeto
- [ ] Realizei self-review do meu código
- [ ] Comentei código complexo
- [ ] Atualizei a documentação
- [ ] Minhas mudanças não geram novos warnings
- [ ] Adicionei testes
- [ ] Todos os testes passam localmente

## Issues Relacionadas

Closes #123
Relates to #456

## Screenshots (se aplicável)

Antes | Depois
----- | ------
![antes](url) | ![depois](url)
```

#### Processo de Review

1. **CI/CD**: Aguarde checks automáticos passarem
2. **Code Review**: Pelo menos 1 aprovação necessária
3. **Discussões**: Responda a comentários e faça ajustes
4. **Merge**: Maintainer fará o merge

---

## Reportando Bugs

### Checklist Antes de Reportar

- [ ] Verifiquei a documentação
- [ ] Procurei em issues existentes
- [ ] Tentei com a última versão
- [ ] Tenho informações para reproduzir o bug

### Informações Necessárias

1. **Ambiente**:
   - OS (Windows/Mac/Linux + versão)
   - .NET SDK version (`dotnet --version`)
   - Browser (se aplicável)

2. **Passos para Reproduzir**:
   - Detalhado, passo a passo
   - URL visitada
   - Ações realizadas

3. **Comportamento Esperado vs Atual**

4. **Logs/Erros**:
   ```
   Stack trace completo
   Mensagens de erro
   Console logs (F12)
   ```

5. **Screenshots/Vídeos** (se aplicável)

---

## Sugerindo Melhorias

### O que Consideramos

- **Alinhamento**: A feature se alinha com os objetivos do projeto?
- **Impacto**: Quantos usuários serão beneficiados?
- **Complexidade**: Qual o esforço de implementação?
- **Manutenibilidade**: Aumenta ou diminui a complexidade?

### Aumentando as Chances de Aceitação

- Descreva claramente o problema que resolve
- Forneça exemplos de uso
- Considere o impacto em features existentes
- Proponha uma implementação (opcional)
- Ofereça-se para implementar

---

## Recursos Adicionais

- **Documentação**: [README.md](README.md)
- **Arquitetura**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Setup**: [SETUP.md](SETUP.md)
- **Roadmap**: [ROADMAP.md](ROADMAP.md)

---

## Dúvidas?

- Abra uma [Discussion](https://github.com/carrijoga/Alvura/discussions)
- Entre em contato: contato@alvura.com.br

---

## Reconhecimento

Contribuidores serão reconhecidos:
- No arquivo [CONTRIBUTORS.md](CONTRIBUTORS.md)
- Nas release notes
- Na documentação

---

<div align="center">

**Obrigado por contribuir com o Alvura!**

Cada contribuição, por menor que seja, faz diferença.

[⬆ Voltar ao README](README.md)

</div>
