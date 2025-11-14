# Alvura - Sistema de Gestão de Lavanderia Industrial

## 📋 Sobre o Projeto

Sistema web para gestão de lavanderia industrial que atende hotéis, com controle de ordens de serviço, clientes, precificação e rastreamento completo do processo.

---

## 🎨 Telas Criadas (HTML/CSS/JS)

### 1. **Dashboard** (`index.html`)
**Funcionalidades:**
- ✅ 4 Cards de métricas principais
- ✅ Gráfico de barras (Produtividade Semanal)
- ✅ Gráfico donut (Status das Ordens)
- ✅ Tabela de ordens recentes
- ✅ Seletor de período (Hoje/Semana/Mês)
- ✅ Totalmente responsivo

**Arquivos:**
- `index.html`
- `styles.css`
- `script.js`

---

### 2. **Lista de Ordens** (`ordens.html`)
**Funcionalidades:**
- ✅ Filtros avançados (Status, Cliente, Data, Motorista)
- ✅ Busca em tempo real
- ✅ Resumo estatístico no topo
- ✅ Tabela completa com paginação
- ✅ Seleção múltipla (checkboxes)
- ✅ Ações por ordem (Ver/Editar/Cancelar)
- ✅ Exportação (Excel/PDF/Imprimir)
- ✅ Badges coloridos por status
- ✅ Indicador de ordens atrasadas

**Arquivos:**
- `ordens.html`
- `ordens-styles.css`
- `ordens.js`

---

### 3. **Criar Ordem de Serviço** (`criar-ordem.html`)
**Funcionalidades:**
- ✅ Seleção de cliente (auto-preenche dados)
- ✅ Campos de data/hora (Solicitação, Coleta, Entrega)
- ✅ Seleção de motorista
- ✅ Sistema de adicionar itens dinâmico
- ✅ Cálculo automático de subtotais e total
- ✅ Tabela de itens com possibilidade de remover
- ✅ Observações por item e por ordem
- ✅ Validações de formulário
- ✅ Cálculo automático de previsão de entrega (2 dias após coleta)

**Arquivos:**
- `criar-ordem.html`
- `criar-ordem.js`

**Como funciona:**
1. Selecione o cliente → dados preenchem automaticamente
2. Defina datas de coleta e entrega
3. Clique em "Adicionar Item"
4. Escolha o item, quantidade → preço e subtotal calculam automaticamente
5. Confirme para adicionar à tabela
6. Repita para adicionar mais itens
7. Submeta o formulário

---

### 4. **Detalhes da Ordem** (`detalhes-ordem.html`)
**Funcionalidades:**
- ✅ Visualização completa dos dados da OS
- ✅ Informações do cliente
- ✅ Datas e prazos
- ✅ Tabela de itens com valores
- ✅ **Timeline interativa de status** (principal destaque!)
- ✅ Histórico completo de mudanças
- ✅ Modal para atualizar status
- ✅ Ações rápidas (Ligar, Email, WhatsApp, Fatura)
- ✅ Botões de editar, imprimir
- ✅ Indicador visual do status atual

**Arquivos:**
- `detalhes-ordem.html`
- `detalhes-ordem.js`

**Timeline de Status:**
- Mostra histórico completo da ordem
- Status atual destacado
- Status concluídos com check
- Informações de data/hora e usuário responsável
- Animação suave ao carregar

---

## 🎨 Design System

### Paleta de Cores
```
Primária:    #2196F3 (Azul)
Sucesso:     #4CAF50 (Verde)
Aviso:       #FF9800 (Laranja)
Erro:        #F44336 (Vermelho)
Secundária:  #9C27B0 (Roxo)

Status:
- Recebido:    #FFC107 (Amarelo)
- Em Lavagem:  #2196F3 (Azul)
- Secagem:     #9E9E9E (Cinza)
- Pronto:      #4CAF50 (Verde)
```

### Tipografia
- Fonte: **Inter** (Google Fonts)
- Pesos: 300, 400, 500, 600, 700

### Componentes
- Cards com shadow sutil
- Botões com estados hover
- Inputs com focus visual
- Badges de status coloridos
- Timeline vertical
- Modal responsivo

---

## 📁 Estrutura de Arquivos

```
alvura/
├── index.html              # Dashboard
├── ordens.html            # Lista de ordens
├── criar-ordem.html       # Criar nova ordem
├── detalhes-ordem.html    # Detalhes da ordem
├── styles.css             # Estilos principais
├── ordens-styles.css      # Estilos específicos de ordens
├── script.js              # JavaScript principal
├── ordens.js              # JavaScript da lista
├── criar-ordem.js         # JavaScript criar ordem
└── detalhes-ordem.js      # JavaScript detalhes
```

---

## 🚀 Como Usar

### Visualizar Localmente
1. Abra o arquivo `index.html` no navegador
2. Navegue entre as telas pelos links
3. Teste as funcionalidades interativas

### Integração com Backend
Os arquivos já estão preparados para integração:

**APIs necessárias:**
```javascript
// Exemplo de endpoints que você precisará criar
GET    /api/ordens              // Listar ordens
GET    /api/ordens/{id}         // Detalhes da ordem
POST   /api/ordens              // Criar ordem
PUT    /api/ordens/{id}         // Atualizar ordem
DELETE /api/ordens/{id}         // Cancelar ordem
GET    /api/clientes            // Listar clientes
GET    /api/itens               // Listar itens de serviço
POST   /api/ordens/{id}/status  // Atualizar status
```

---

## ✨ Funcionalidades Implementadas

### JavaScript
- ✅ Menu lateral responsivo (hamburguer mobile)
- ✅ Filtros com busca em tempo real
- ✅ Seleção de múltiplos checkboxes
- ✅ Paginação interativa
- ✅ Modal de atualização de status
- ✅ Cálculo automático de valores
- ✅ Validações de formulário
- ✅ Animações suaves
- ✅ Gráficos interativos (Chart.js)
- ✅ Timeline animada

### Responsividade
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Mobile (375px)

---

## 🔧 Bibliotecas Utilizadas

- **Chart.js** (Gráficos)
- **Font Awesome** (Ícones)
- **Google Fonts - Inter** (Tipografia)

---

## 📊 Status das Ordens (Fluxo)

```
Solicitado → Coletado → Em Lavagem → Secagem → 
Passadoria → Embalado → Pronto → Em Rota → Entregue
```

Cada status tem:
- Cor específica
- Badge visual
- Registro no histórico
- Data/hora da mudança
- Usuário responsável

---

## 🎯 Próximos Passos

### Backend (ASP.NET Core)
1. Criar as APIs REST
2. Implementar Entity Framework
3. Configurar SQL Server
4. Implementar autenticação JWT
5. Configurar SignalR para atualizações em tempo real

### Frontend (Blazor WASM)
1. Converter HTML para componentes Blazor
2. Implementar serviços de API
3. Adicionar autenticação
4. Implementar estado global
5. Adicionar validações do lado do cliente

### Funcionalidades Futuras
- [ ] Portal do cliente (hotéis)
- [ ] App mobile para motoristas
- [ ] Integração WhatsApp Business API
- [ ] Relatórios avançados
- [ ] Controle de estoque de insumos
- [ ] Sistema de notificações
- [ ] Geração de etiquetas/códigos de barras
- [ ] Controle de qualidade
- [ ] Gestão financeira completa

---

## 📝 Notas Importantes

### Dados Mockados
Todos os dados nas telas são fictícios (mock data) para demonstração.
Na integração real, virão do backend via API.

### Validações
As validações básicas estão implementadas no JavaScript.
Validações do lado do servidor devem ser adicionadas na API.

### Performance
- Imagens otimizadas (avatars via API externa)
- CSS minificado pode ser gerado para produção
- JavaScript pode ser bundled e minificado

---

## 🤝 Suporte

Dúvidas sobre o projeto? Entre em contato!

**Versão:** 1.0.0  
**Data:** Novembro 2024  
**Status:** Protótipo Funcional (MVP Visual)
