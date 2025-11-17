# Especificação da API - Alvura

## Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Endpoints de Ordens](#endpoints-de-ordens)
4. [Endpoints de Clientes](#endpoints-de-clientes)
5. [Endpoints de Estoque](#endpoints-de-estoque)
6. [Endpoints Financeiros](#endpoints-financeiros)
7. [Endpoints de Relatórios](#endpoints-de-relatórios)
8. [Endpoints de Usuários](#endpoints-de-usuários)
9. [WebSocket/SignalR](#websocketsignalr)
10. [Códigos de Status](#códigos-de-status)
11. [Modelos de Dados](#modelos-de-dados)

---

## Visão Geral

**Base URL**:
- Desenvolvimento: `https://localhost:5001/api`
- Produção: `https://api.alvura.com.br/api`

**Versão**: `v1`

**Content-Type**: `application/json`

**Formato de Data**: ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)

**Paginação**: Query parameters `page` e `pageSize`

**Autenticação**: JWT Bearer Token

---

## Autenticação

### POST `/auth/login`

Autenticar usuário e obter token JWT.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "8f6d8a9b-3c7e-4d5a-9b2f-1a3c5d7e9f0b",
    "expiresIn": 3600,
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "user@example.com",
      "role": "Manager",
      "avatar": "https://api.alvura.com.br/avatars/1.jpg"
    }
  }
}
```

**Response 401**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email ou senha inválidos"
  }
}
```

---

### POST `/auth/refresh`

Renovar token JWT usando refresh token.

**Request Body**:
```json
{
  "refreshToken": "8f6d8a9b-3c7e-4d5a-9b2f-1a3c5d7e9f0b"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

---

### POST `/auth/logout`

Invalidar refresh token (logout).

**Headers**:
```
Authorization: Bearer {token}
```

**Response 204**: No Content

---

## Endpoints de Ordens

### GET `/orders`

Listar todas as ordens com filtros e paginação.

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:

| Parâmetro | Tipo | Obrigatório | Descrição | Exemplo |
|-----------|------|-------------|-----------|---------|
| `page` | integer | Não | Número da página (padrão: 1) | `1` |
| `pageSize` | integer | Não | Itens por página (padrão: 20, máx: 100) | `50` |
| `status` | string | Não | Filtrar por status | `InWashing` |
| `clientId` | integer | Não | Filtrar por cliente | `5` |
| `driverId` | integer | Não | Filtrar por motorista | `3` |
| `startDate` | date | Não | Data início (coleta) | `2024-01-01` |
| `endDate` | date | Não | Data fim (coleta) | `2024-12-31` |
| `search` | string | Não | Buscar por número OS ou cliente | `OS-2024` |
| `sortBy` | string | Não | Campo de ordenação | `collectionDate` |
| `sortOrder` | string | Não | Ordem (`asc` ou `desc`) | `desc` |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "orderNumber": "OS-2024-001234",
        "client": {
          "id": 5,
          "name": "Hotel Marriott",
          "document": "12.345.678/0001-90"
        },
        "status": "InWashing",
        "statusLabel": "Em Lavagem",
        "requestDate": "2024-11-15T08:30:00Z",
        "collectionDate": "2024-11-15T10:00:00Z",
        "deliveryDate": "2024-11-17T10:00:00Z",
        "driver": {
          "id": 3,
          "name": "Carlos Souza"
        },
        "totalAmount": 1250.00,
        "itemCount": 15,
        "isOverdue": false,
        "createdAt": "2024-11-15T08:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalItems": 156,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "filters": {
      "status": null,
      "clientId": null,
      "driverId": null,
      "startDate": null,
      "endDate": null,
      "search": null
    }
  }
}
```

---

### GET `/orders/{id}`

Obter detalhes completos de uma ordem.

**Headers**:
```
Authorization: Bearer {token}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "OS-2024-001234",
    "client": {
      "id": 5,
      "name": "Hotel Marriott",
      "document": "12.345.678/0001-90",
      "email": "contato@marriott.com.br",
      "phone": "(11) 3456-7890",
      "address": {
        "street": "Av. Paulista",
        "number": "1000",
        "complement": "Torre A",
        "district": "Bela Vista",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01310-100"
      },
      "contactPerson": "Maria Silva"
    },
    "status": "InWashing",
    "statusLabel": "Em Lavagem",
    "requestDate": "2024-11-15T08:30:00Z",
    "collectionDate": "2024-11-15T10:00:00Z",
    "deliveryDate": "2024-11-17T10:00:00Z",
    "driver": {
      "id": 3,
      "name": "Carlos Souza",
      "phone": "(11) 98765-4321"
    },
    "items": [
      {
        "id": 1,
        "serviceItem": {
          "id": 10,
          "name": "Lençol Solteiro",
          "unit": "Peça"
        },
        "quantity": 50,
        "unitPrice": 8.50,
        "subtotal": 425.00,
        "notes": null
      },
      {
        "id": 2,
        "serviceItem": {
          "id": 11,
          "name": "Toalha de Banho",
          "unit": "Peça"
        },
        "quantity": 100,
        "unitPrice": 5.00,
        "subtotal": 500.00,
        "notes": "Atenção: toalhas brancas"
      }
    ],
    "totalAmount": 1250.00,
    "notes": "Prioridade alta - cliente VIP",
    "statusHistory": [
      {
        "id": 1,
        "status": "Requested",
        "statusLabel": "Solicitado",
        "changedAt": "2024-11-15T08:30:00Z",
        "changedBy": {
          "id": 1,
          "name": "Ana Paula"
        },
        "notes": "Ordem criada pelo sistema"
      },
      {
        "id": 2,
        "status": "Collected",
        "statusLabel": "Coletado",
        "changedAt": "2024-11-15T10:15:00Z",
        "changedBy": {
          "id": 3,
          "name": "Carlos Souza"
        },
        "notes": "Coleta realizada com sucesso"
      },
      {
        "id": 3,
        "status": "InWashing",
        "statusLabel": "Em Lavagem",
        "changedAt": "2024-11-15T11:00:00Z",
        "changedBy": {
          "id": 5,
          "name": "Pedro Santos"
        },
        "notes": "Iniciada lavagem na máquina 03"
      }
    ],
    "createdAt": "2024-11-15T08:30:00Z",
    "updatedAt": "2024-11-15T11:00:00Z",
    "createdBy": {
      "id": 1,
      "name": "Ana Paula"
    }
  }
}
```

**Response 404**:
```json
{
  "success": false,
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Ordem de serviço não encontrada"
  }
}
```

---

### POST `/orders`

Criar nova ordem de serviço.

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "clientId": 5,
  "requestDate": "2024-11-15T08:30:00Z",
  "collectionDate": "2024-11-15T10:00:00Z",
  "deliveryDate": "2024-11-17T10:00:00Z",
  "driverId": 3,
  "items": [
    {
      "serviceItemId": 10,
      "quantity": 50,
      "unitPrice": 8.50,
      "notes": null
    },
    {
      "serviceItemId": 11,
      "quantity": 100,
      "unitPrice": 5.00,
      "notes": "Atenção: toalhas brancas"
    }
  ],
  "notes": "Prioridade alta - cliente VIP"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "OS-2024-001234",
    "status": "Requested",
    "totalAmount": 1250.00,
    "createdAt": "2024-11-15T08:30:00Z"
  }
}
```

**Response 400** (Validação):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Erro de validação",
    "details": [
      {
        "field": "clientId",
        "message": "Cliente é obrigatório"
      },
      {
        "field": "items",
        "message": "Deve conter pelo menos 1 item"
      }
    ]
  }
}
```

---

### PUT `/orders/{id}/status`

Atualizar status da ordem.

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "status": "InWashing",
  "notes": "Iniciada lavagem na máquina 03"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "OS-2024-001234",
    "status": "InWashing",
    "statusLabel": "Em Lavagem",
    "updatedAt": "2024-11-15T11:00:00Z"
  }
}
```

**Response 400**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Transição de status inválida: Delivered → InWashing"
  }
}
```

---

### PUT `/orders/{id}`

Atualizar ordem de serviço (somente rascunhos).

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "collectionDate": "2024-11-16T10:00:00Z",
  "deliveryDate": "2024-11-18T10:00:00Z",
  "driverId": 4,
  "items": [
    {
      "serviceItemId": 10,
      "quantity": 60,
      "unitPrice": 8.50
    }
  ],
  "notes": "Atualizado: prazo estendido"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "OS-2024-001234",
    "totalAmount": 510.00,
    "updatedAt": "2024-11-15T12:00:00Z"
  }
}
```

---

### DELETE `/orders/{id}`

Cancelar ordem de serviço.

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `reason` (string, obrigatório): Motivo do cancelamento

**Response 204**: No Content

**Response 400**:
```json
{
  "success": false,
  "error": {
    "code": "CANNOT_CANCEL_ORDER",
    "message": "Não é possível cancelar ordem já entregue"
  }
}
```

---

## Endpoints de Clientes

### GET `/clients`

Listar todos os clientes.

**Query Parameters**:
- `page`, `pageSize`, `search`, `sortBy`, `sortOrder`
- `isActive` (boolean): Filtrar por status ativo/inativo

**Response 200**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 5,
        "name": "Hotel Marriott",
        "tradeName": "Marriott SP Paulista",
        "document": "12.345.678/0001-90",
        "email": "contato@marriott.com.br",
        "phone": "(11) 3456-7890",
        "address": {
          "city": "São Paulo",
          "state": "SP"
        },
        "contactPerson": "Maria Silva",
        "isActive": true,
        "totalOrders": 156,
        "totalRevenue": 125000.00,
        "createdAt": "2023-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalItems": 45,
      "totalPages": 3
    }
  }
}
```

---

### GET `/clients/{id}`

Obter detalhes de um cliente.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Hotel Marriott Ltda",
    "tradeName": "Marriott SP Paulista",
    "document": "12.345.678/0001-90",
    "stateRegistration": "123.456.789.012",
    "municipalRegistration": "987654321",
    "email": "contato@marriott.com.br",
    "phone": "(11) 3456-7890",
    "mobilePhone": "(11) 98765-4321",
    "address": {
      "street": "Av. Paulista",
      "number": "1000",
      "complement": "Torre A",
      "district": "Bela Vista",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01310-100",
      "country": "Brasil"
    },
    "contactPerson": "Maria Silva",
    "contactEmail": "maria@marriott.com.br",
    "contactPhone": "(11) 91234-5678",
    "isActive": true,
    "notes": "Cliente VIP - atendimento prioritário",
    "statistics": {
      "totalOrders": 156,
      "pendingOrders": 5,
      "completedOrders": 150,
      "cancelledOrders": 1,
      "totalRevenue": 125000.00,
      "averageOrderValue": 800.00
    },
    "createdAt": "2023-01-15T00:00:00Z",
    "updatedAt": "2024-11-10T15:30:00Z"
  }
}
```

---

### POST `/clients`

Criar novo cliente.

**Request Body**:
```json
{
  "name": "Hotel Marriott Ltda",
  "tradeName": "Marriott SP Paulista",
  "document": "12.345.678/0001-90",
  "email": "contato@marriott.com.br",
  "phone": "(11) 3456-7890",
  "address": {
    "street": "Av. Paulista",
    "number": "1000",
    "complement": "Torre A",
    "district": "Bela Vista",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01310-100"
  },
  "contactPerson": "Maria Silva",
  "contactEmail": "maria@marriott.com.br",
  "contactPhone": "(11) 91234-5678"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Hotel Marriott Ltda",
    "document": "12.345.678/0001-90",
    "isActive": true,
    "createdAt": "2024-11-15T10:00:00Z"
  }
}
```

---

### PUT `/clients/{id}`

Atualizar cliente.

**Request Body**: Mesma estrutura do POST

**Response 200**: Cliente atualizado

---

### DELETE `/clients/{id}`

Desativar cliente (soft delete).

**Response 204**: No Content

---

## Endpoints de Estoque

### GET `/inventory`

Listar itens de estoque.

**Query Parameters**:
- Padrões de paginação e busca
- `category` (string): Filtrar por categoria
- `lowStock` (boolean): Apenas itens com estoque baixo

**Response 200**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Detergente Líquido Industrial",
        "category": "Produtos de Limpeza",
        "unit": "Litro",
        "currentStock": 150.0,
        "minimumStock": 50.0,
        "maximumStock": 500.0,
        "unitCost": 12.50,
        "totalValue": 1875.00,
        "isLowStock": false,
        "supplier": {
          "id": 3,
          "name": "Distribuidora ABC"
        },
        "lastPurchase": "2024-11-01T00:00:00Z"
      }
    ],
    "pagination": { }
  }
}
```

---

### GET `/inventory/{id}`

Detalhes do item de estoque.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Detergente Líquido Industrial",
    "description": "Detergente concentrado para lavagem industrial",
    "category": "Produtos de Limpeza",
    "unit": "Litro",
    "currentStock": 150.0,
    "minimumStock": 50.0,
    "maximumStock": 500.0,
    "unitCost": 12.50,
    "totalValue": 1875.00,
    "supplier": {
      "id": 3,
      "name": "Distribuidora ABC",
      "phone": "(11) 3000-4000"
    },
    "movementHistory": [
      {
        "id": 100,
        "type": "Purchase",
        "quantity": 200.0,
        "unitCost": 12.50,
        "total": 2500.00,
        "date": "2024-11-01T10:00:00Z",
        "notes": "Compra mensal - NF 12345",
        "user": {
          "id": 1,
          "name": "Ana Paula"
        }
      },
      {
        "id": 101,
        "type": "Usage",
        "quantity": -50.0,
        "date": "2024-11-05T14:30:00Z",
        "notes": "Uso na lavagem - OS-2024-001200",
        "user": {
          "id": 5,
          "name": "Pedro Santos"
        }
      }
    ],
    "isActive": true,
    "createdAt": "2023-05-10T00:00:00Z",
    "updatedAt": "2024-11-01T10:00:00Z"
  }
}
```

---

### POST `/inventory`

Criar item de estoque.

**Request Body**:
```json
{
  "name": "Detergente Líquido Industrial",
  "description": "Detergente concentrado",
  "category": "Produtos de Limpeza",
  "unit": "Litro",
  "currentStock": 100.0,
  "minimumStock": 50.0,
  "maximumStock": 500.0,
  "unitCost": 12.50,
  "supplierId": 3
}
```

**Response 201**: Item criado

---

### POST `/inventory/{id}/movement`

Registrar movimentação de estoque.

**Request Body**:
```json
{
  "type": "Purchase",
  "quantity": 200.0,
  "unitCost": 12.50,
  "notes": "Compra mensal - NF 12345"
}
```

**Types**: `Purchase` (entrada), `Usage` (saída), `Adjustment` (ajuste)

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 100,
    "newStock": 300.0,
    "movementDate": "2024-11-15T10:00:00Z"
  }
}
```

---

## Endpoints Financeiros

### GET `/financial/invoices`

Listar faturas.

**Query Parameters**:
- Padrões + `status`, `clientId`, `startDate`, `endDate`

**Response 200**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "invoiceNumber": "NF-2024-001234",
        "orderId": 5,
        "orderNumber": "OS-2024-001234",
        "client": {
          "id": 5,
          "name": "Hotel Marriott"
        },
        "issueDate": "2024-11-15T00:00:00Z",
        "dueDate": "2024-11-30T00:00:00Z",
        "amount": 1250.00,
        "paidAmount": 0.00,
        "status": "Pending",
        "statusLabel": "Pendente",
        "isOverdue": false
      }
    ],
    "summary": {
      "totalPending": 15000.00,
      "totalPaid": 125000.00,
      "totalOverdue": 2500.00
    },
    "pagination": { }
  }
}
```

---

### GET `/financial/invoices/{id}`

Detalhes da fatura.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "invoiceNumber": "NF-2024-001234",
    "order": {
      "id": 5,
      "orderNumber": "OS-2024-001234"
    },
    "client": {
      "id": 5,
      "name": "Hotel Marriott",
      "document": "12.345.678/0001-90",
      "address": { }
    },
    "issueDate": "2024-11-15T00:00:00Z",
    "dueDate": "2024-11-30T00:00:00Z",
    "amount": 1250.00,
    "discount": 0.00,
    "netAmount": 1250.00,
    "paidAmount": 0.00,
    "status": "Pending",
    "items": [
      {
        "description": "Lençol Solteiro",
        "quantity": 50,
        "unitPrice": 8.50,
        "total": 425.00
      }
    ],
    "payments": [],
    "notes": null
  }
}
```

---

### POST `/financial/invoices/{id}/payment`

Registrar pagamento.

**Request Body**:
```json
{
  "amount": 1250.00,
  "paymentDate": "2024-11-20T00:00:00Z",
  "paymentMethod": "BankTransfer",
  "notes": "Transferência Banco do Brasil"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 50,
    "invoiceId": 1,
    "amount": 1250.00,
    "paidAmount": 1250.00,
    "newStatus": "Paid",
    "paymentDate": "2024-11-20T00:00:00Z"
  }
}
```

---

## Endpoints de Relatórios

### GET `/reports/dashboard`

Métricas do dashboard.

**Query Parameters**:
- `period` (string): `today`, `week`, `month`, `year`
- `startDate`, `endDate`: Período customizado

**Response 200**:
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-11-01T00:00:00Z",
      "end": "2024-11-30T23:59:59Z",
      "label": "Novembro 2024"
    },
    "metrics": {
      "totalOrders": 156,
      "pendingOrders": 25,
      "completedOrders": 130,
      "cancelledOrders": 1,
      "totalRevenue": 125000.00,
      "pendingRevenue": 15000.00,
      "averageOrderValue": 800.00,
      "activeClients": 45
    },
    "charts": {
      "weeklyProductivity": [
        { "day": "Seg", "orders": 20, "revenue": 16000.00 },
        { "day": "Ter", "orders": 25, "revenue": 20000.00 },
        { "day": "Qua", "orders": 22, "revenue": 17600.00 },
        { "day": "Qui", "orders": 28, "revenue": 22400.00 },
        { "day": "Sex", "orders": 30, "revenue": 24000.00 },
        { "day": "Sáb", "orders": 18, "revenue": 14400.00 },
        { "day": "Dom", "orders": 13, "revenue": 10600.00 }
      ],
      "ordersByStatus": [
        { "status": "Pending", "count": 5, "percentage": 3.2 },
        { "status": "InProgress", "count": 20, "percentage": 12.8 },
        { "status": "Completed", "count": 130, "percentage": 83.3 },
        { "status": "Cancelled", "count": 1, "percentage": 0.7 }
      ]
    },
    "recentOrders": [
      {
        "id": 156,
        "orderNumber": "OS-2024-001234",
        "client": "Hotel Marriott",
        "status": "InWashing",
        "amount": 1250.00,
        "date": "2024-11-15T08:30:00Z"
      }
    ]
  }
}
```

---

### GET `/reports/orders`

Relatório de ordens exportável.

**Query Parameters**:
- Filtros de ordens + `format` (`json`, `csv`, `pdf`, `excel`)

**Response 200** (JSON):
```json
{
  "success": true,
  "data": {
    "report": "orders",
    "filters": { },
    "generatedAt": "2024-11-15T10:00:00Z",
    "rows": [
      {
        "orderNumber": "OS-2024-001234",
        "client": "Hotel Marriott",
        "status": "Delivered",
        "requestDate": "2024-11-15",
        "deliveryDate": "2024-11-17",
        "amount": 1250.00
      }
    ],
    "summary": {
      "totalOrders": 156,
      "totalAmount": 125000.00
    }
  }
}
```

**Response 200** (CSV/Excel/PDF):
- Content-Type: `text/csv`, `application/vnd.ms-excel`, `application/pdf`
- Content-Disposition: `attachment; filename="orders-report-2024-11-15.csv"`

---

## Endpoints de Usuários

### GET `/users`

Listar usuários (Admin only).

**Response 200**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Ana Paula",
        "email": "ana@alvura.com.br",
        "role": "Manager",
        "isActive": true,
        "createdAt": "2023-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

### POST `/users`

Criar usuário (Admin only).

**Request Body**:
```json
{
  "name": "João Silva",
  "email": "joao@alvura.com.br",
  "password": "SecurePass123!",
  "role": "Operator",
  "phone": "(11) 98765-4321"
}
```

**Response 201**: Usuário criado

---

## WebSocket/SignalR

### Hub: `/hubs/orders`

**Eventos do servidor → cliente**:

#### `ReceiveOrderStatusUpdate`
```json
{
  "orderId": 1,
  "orderNumber": "OS-2024-001234",
  "status": "InWashing",
  "statusLabel": "Em Lavagem",
  "updatedAt": "2024-11-15T11:00:00Z",
  "updatedBy": "Pedro Santos"
}
```

#### `ReceiveNewOrder`
```json
{
  "orderId": 157,
  "orderNumber": "OS-2024-001235",
  "client": "Hotel Hilton",
  "createdAt": "2024-11-15T11:30:00Z"
}
```

#### `ReceiveNotification`
```json
{
  "type": "Warning",
  "title": "Estoque Baixo",
  "message": "Detergente líquido com estoque abaixo do mínimo",
  "timestamp": "2024-11-15T12:00:00Z"
}
```

**Eventos do cliente → servidor**:

#### `JoinOrderRoom`
```json
{
  "orderId": 1
}
```

#### `LeaveOrderRoom`
```json
{
  "orderId": 1
}
```

---

## Códigos de Status

| Código | Significado | Uso |
|--------|-------------|-----|
| **200** | OK | Sucesso (GET, PUT) |
| **201** | Created | Recurso criado (POST) |
| **204** | No Content | Sucesso sem retorno (DELETE) |
| **400** | Bad Request | Validação falhou |
| **401** | Unauthorized | Não autenticado |
| **403** | Forbidden | Sem permissão |
| **404** | Not Found | Recurso não existe |
| **409** | Conflict | Conflito (ex: CNPJ duplicado) |
| **422** | Unprocessable Entity | Regra de negócio violada |
| **500** | Internal Server Error | Erro do servidor |
| **503** | Service Unavailable | Serviço indisponível |

---

## Modelos de Dados

### Envelope de Resposta

Todas as respostas seguem este padrão:

**Sucesso**:
```json
{
  "success": true,
  "data": { }
}
```

**Erro**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem amigável",
    "details": [ ]
  }
}
```

---

### OrderStatus (Enum)

| Valor | Label | Descrição |
|-------|-------|-----------|
| `Requested` | Solicitado | Ordem criada |
| `Collected` | Coletado | Roupas coletadas |
| `InWashing` | Em Lavagem | Em processo de lavagem |
| `Drying` | Secagem | Em secagem |
| `Ironing` | Passadoria | Em passadoria |
| `Packed` | Embalado | Embalado e pronto |
| `Ready` | Pronto | Pronto para entrega |
| `InRoute` | Em Rota | Saiu para entrega |
| `Delivered` | Entregue | Entregue ao cliente |
| `Cancelled` | Cancelado | Ordem cancelada |

---

### InvoiceStatus (Enum)

| Valor | Label |
|-------|-------|
| `Pending` | Pendente |
| `PartiallyPaid` | Parcialmente Pago |
| `Paid` | Pago |
| `Overdue` | Atrasado |
| `Cancelled` | Cancelado |

---

### UserRole (Enum)

| Valor | Permissões |
|-------|------------|
| `Admin` | Acesso total |
| `Manager` | Gerenciar tudo exceto usuários |
| `Operator` | Criar/editar ordens |
| `Driver` | Ver ordens atribuídas |
| `Client` | Portal cliente (leitura) |

---

## Rate Limiting

**Limites por IP**:
- Anônimo: 10 req/min
- Autenticado: 100 req/min
- Admin: 200 req/min

**Headers de resposta**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699999999
```

---

## Versionamento

A API usa versionamento por URL:
- v1: `/api/v1/orders`
- v2: `/api/v2/orders` (futuro)

**Política de deprecação**: 6 meses de aviso

---

## Postman Collection

Importe a collection completa:
- [Download Postman Collection](https://api.alvura.com.br/docs/postman-collection.json)

---

<div align="center">

**Especificação da API - Alvura System**

[⬆ Voltar ao README](../README.md)

</div>
