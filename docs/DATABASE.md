# Schema do Banco de Dados - Alvura

## Índice

1. [Visão Geral](#visão-geral)
2. [Diagrama Entidade-Relacionamento](#diagrama-entidade-relacionamento)
3. [Tabelas](#tabelas)
4. [Relacionamentos](#relacionamentos)
5. [Índices](#índices)
6. [Stored Procedures](#stored-procedures)
7. [Views](#views)
8. [Migrations](#migrations)

---

## Visão Geral

**SGBD**: SQL Server 2019+
**Collation**: `Latin1_General_CI_AS`
**Schema**: `dbo` (default)

**Convenções**:
- Tabelas: PascalCase plural (`Orders`, `Clients`)
- PKs: `Id` (int, identity)
- FKs: `{Tabela}Id` (ex: `ClientId`)
- Timestamps: `CreatedAt`, `UpdatedAt`
- Soft Delete: `IsDeleted` (bit), `DeletedAt` (datetime2)
- Auditoria: `CreatedBy`, `UpdatedBy` (nvarchar)

---

## Diagrama Entidade-Relacionamento

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ Id (PK)         │
│ Name            │
│ Email (UQ)      │
│ PasswordHash    │
│ Role            │
│ IsActive        │
└─────────────────┘
         │
         │ 1:N (CreatedBy)
         ▼
┌─────────────────┐          ┌─────────────────┐
│    Clients      │          │  ServiceItems   │
├─────────────────┤          ├─────────────────┤
│ Id (PK)         │          │ Id (PK)         │
│ Name            │          │ Name            │
│ Document (UQ)   │          │ UnitPrice       │
│ Email           │          │ Unit            │
│ Phone           │          │ Category        │
│ Address         │          │ IsActive        │
│ ContactPerson   │          └─────────────────┘
│ IsActive        │                   │
└─────────────────┘                   │
         │                            │
         │ 1:N                        │
         ▼                            │
┌─────────────────┐                   │
│     Orders      │                   │
├─────────────────┤                   │
│ Id (PK)         │                   │
│ OrderNumber(UQ) │                   │
│ ClientId (FK)   │───┐               │
│ Status          │   │               │
│ RequestDate     │   │               │
│ CollectionDate  │   │               │
│ DeliveryDate    │   │               │
│ DriverId (FK)   │───┼───────┐       │
│ TotalAmount     │   │       │       │
│ Notes           │   │       │       │
│ CreatedAt       │   │       │       │
│ CreatedBy (FK)  │───┘       │       │
└─────────────────┘           │       │
         │                    │       │
         │ 1:N                │       │
         ▼                    │       │
┌─────────────────┐           │       │
│   OrderItems    │           │       │
├─────────────────┤           │       │
│ Id (PK)         │           │       │
│ OrderId (FK)    │           │       │
│ ServiceItemId(FK)│──────────┼───────┘
│ Quantity        │           │
│ UnitPrice       │           │
│ Subtotal        │           │
│ Notes           │           │
└─────────────────┘           │
                              │
         ┌────────────────────┘
         │ 1:N
         ▼
┌─────────────────┐
│OrderStatusLogs  │
├─────────────────┤
│ Id (PK)         │
│ OrderId (FK)    │
│ Status          │
│ ChangedAt       │
│ ChangedBy (FK)  │
│ Notes           │
└─────────────────┘

┌─────────────────┐          ┌─────────────────┐
│   Invoices      │          │    Payments     │
├─────────────────┤          ├─────────────────┤
│ Id (PK)         │          │ Id (PK)         │
│ InvoiceNumber(UQ)│         │ InvoiceId (FK)  │─┐
│ OrderId (FK)    │◄─────────│ Amount          │ │
│ ClientId (FK)   │          │ PaymentDate     │ │
│ IssueDate       │          │ PaymentMethod   │ │
│ DueDate         │          │ Notes           │ │
│ Amount          │          │ CreatedBy (FK)  │─┘
│ Status          │          └─────────────────┘
│ PaidAmount      │
└─────────────────┘

┌─────────────────┐          ┌─────────────────┐
│InventoryItems  │          │ StockMovements  │
├─────────────────┤          ├─────────────────┤
│ Id (PK)         │          │ Id (PK)         │
│ Name            │          │ ItemId (FK)     │─┐
│ Category        │◄─────────│ Type            │ │
│ Unit            │          │ Quantity        │ │
│ CurrentStock    │          │ UnitCost        │ │
│ MinimumStock    │          │ MovementDate    │ │
│ MaximumStock    │          │ Notes           │ │
│ UnitCost        │          │ UserId (FK)     │─┘
│ SupplierId (FK) │          └─────────────────┘
└─────────────────┘
```

---

## Tabelas

### Users (Usuários)

```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('Admin', 'Manager', 'Operator', 'Driver', 'Client')),
    Phone NVARCHAR(20),
    Avatar NVARCHAR(255),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    LastLoginAt DATETIME2,

    INDEX IX_Users_Email (Email),
    INDEX IX_Users_Role (Role),
    INDEX IX_Users_IsActive (IsActive)
);
```

---

### Clients (Clientes)

```sql
CREATE TABLE Clients (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(200) NOT NULL,
    TradeName NVARCHAR(200),
    Document NVARCHAR(18) NOT NULL UNIQUE,
    StateRegistration NVARCHAR(20),
    MunicipalRegistration NVARCHAR(20),

    Email NVARCHAR(100),
    Phone NVARCHAR(20),
    MobilePhone NVARCHAR(20),

    -- Endereço (desnormalizado por simplicidade)
    AddressStreet NVARCHAR(200),
    AddressNumber NVARCHAR(20),
    AddressComplement NVARCHAR(100),
    AddressDistrict NVARCHAR(100),
    AddressCity NVARCHAR(100),
    AddressState NVARCHAR(2),
    AddressZipCode NVARCHAR(10),
    AddressCountry NVARCHAR(50) DEFAULT 'Brasil',

    ContactPerson NVARCHAR(100),
    ContactEmail NVARCHAR(100),
    ContactPhone NVARCHAR(20),

    Notes NVARCHAR(MAX),
    IsActive BIT NOT NULL DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy NVARCHAR(100),
    UpdatedBy NVARCHAR(100),

    INDEX IX_Clients_Document (Document),
    INDEX IX_Clients_Name (Name),
    INDEX IX_Clients_IsActive (IsActive)
);
```

---

### Orders (Ordens de Serviço)

```sql
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderNumber NVARCHAR(20) NOT NULL UNIQUE,
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(Id),

    Status NVARCHAR(20) NOT NULL CHECK (Status IN (
        'Requested', 'Collected', 'InWashing', 'Drying',
        'Ironing', 'Packed', 'Ready', 'InRoute', 'Delivered', 'Cancelled'
    )),

    RequestDate DATETIME2 NOT NULL,
    CollectionDate DATETIME2,
    DeliveryDate DATETIME2,

    DriverId INT FOREIGN KEY REFERENCES Users(Id),

    TotalAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    Notes NVARCHAR(MAX),

    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy NVARCHAR(100),
    UpdatedBy NVARCHAR(100),

    INDEX IX_Orders_OrderNumber (OrderNumber),
    INDEX IX_Orders_ClientId (ClientId),
    INDEX IX_Orders_Status (Status),
    INDEX IX_Orders_CollectionDate (CollectionDate),
    INDEX IX_Orders_DeliveryDate (DeliveryDate),
    INDEX IX_Orders_DriverId (DriverId),
    INDEX IX_Orders_CreatedAt (CreatedAt DESC)
);
```

**Trigger para gerar OrderNumber automaticamente**:

```sql
CREATE TRIGGER trg_Orders_GenerateOrderNumber
ON Orders
AFTER INSERT
AS
BEGIN
    UPDATE Orders
    SET OrderNumber = 'OS-' + CAST(YEAR(GETDATE()) AS VARCHAR(4)) + '-'
                     + RIGHT('000000' + CAST(Id AS VARCHAR(6)), 6)
    WHERE Id IN (SELECT Id FROM inserted) AND OrderNumber IS NULL;
END;
```

---

### OrderItems (Itens da Ordem)

```sql
CREATE TABLE OrderItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(Id) ON DELETE CASCADE,
    ServiceItemId INT NOT NULL FOREIGN KEY REFERENCES ServiceItems(Id),

    Quantity DECIMAL(18,2) NOT NULL CHECK (Quantity > 0),
    UnitPrice DECIMAL(18,2) NOT NULL CHECK (UnitPrice >= 0),
    Subtotal AS (Quantity * UnitPrice) PERSISTED,

    Notes NVARCHAR(500),

    INDEX IX_OrderItems_OrderId (OrderId),
    INDEX IX_OrderItems_ServiceItemId (ServiceItemId)
);
```

---

### OrderStatusLogs (Histórico de Status)

```sql
CREATE TABLE OrderStatusLogs (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(Id) ON DELETE CASCADE,

    Status NVARCHAR(20) NOT NULL,
    ChangedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ChangedBy NVARCHAR(100),
    Notes NVARCHAR(500),

    INDEX IX_OrderStatusLogs_OrderId (OrderId),
    INDEX IX_OrderStatusLogs_ChangedAt (ChangedAt DESC)
);
```

**Trigger para log automático de mudanças de status**:

```sql
CREATE TRIGGER trg_Orders_LogStatusChange
ON Orders
AFTER INSERT, UPDATE
AS
BEGIN
    IF UPDATE(Status)
    BEGIN
        INSERT INTO OrderStatusLogs (OrderId, Status, ChangedAt, ChangedBy, Notes)
        SELECT i.Id, i.Status, GETUTCDATE(), i.UpdatedBy,
               'Status alterado de ' + ISNULL(d.Status, 'NULL') + ' para ' + i.Status
        FROM inserted i
        LEFT JOIN deleted d ON i.Id = d.Id
        WHERE i.Status != ISNULL(d.Status, '');
    END
END;
```

---

### ServiceItems (Itens de Serviço/Tabela de Preços)

```sql
CREATE TABLE ServiceItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Category NVARCHAR(50),

    UnitPrice DECIMAL(18,2) NOT NULL CHECK (UnitPrice >= 0),
    Unit NVARCHAR(20) NOT NULL DEFAULT 'Peça',

    IsActive BIT NOT NULL DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    INDEX IX_ServiceItems_Name (Name),
    INDEX IX_ServiceItems_Category (Category),
    INDEX IX_ServiceItems_IsActive (IsActive)
);
```

---

### Invoices (Faturas/Notas Fiscais)

```sql
CREATE TABLE Invoices (
    Id INT PRIMARY KEY IDENTITY(1,1),
    InvoiceNumber NVARCHAR(20) NOT NULL UNIQUE,
    OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(Id),
    ClientId INT NOT NULL FOREIGN KEY REFERENCES Clients(Id),

    IssueDate DATETIME2 NOT NULL,
    DueDate DATETIME2 NOT NULL,

    Amount DECIMAL(18,2) NOT NULL CHECK (Amount >= 0),
    Discount DECIMAL(18,2) NOT NULL DEFAULT 0 CHECK (Discount >= 0),
    NetAmount AS (Amount - Discount) PERSISTED,
    PaidAmount DECIMAL(18,2) NOT NULL DEFAULT 0 CHECK (PaidAmount >= 0),

    Status NVARCHAR(20) NOT NULL CHECK (Status IN (
        'Pending', 'PartiallyPaid', 'Paid', 'Overdue', 'Cancelled'
    )),

    Notes NVARCHAR(MAX),

    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy NVARCHAR(100),

    INDEX IX_Invoices_InvoiceNumber (InvoiceNumber),
    INDEX IX_Invoices_OrderId (OrderId),
    INDEX IX_Invoices_ClientId (ClientId),
    INDEX IX_Invoices_Status (Status),
    INDEX IX_Invoices_DueDate (DueDate)
);
```

---

### Payments (Pagamentos)

```sql
CREATE TABLE Payments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    InvoiceId INT NOT NULL FOREIGN KEY REFERENCES Invoices(Id),

    Amount DECIMAL(18,2) NOT NULL CHECK (Amount > 0),
    PaymentDate DATETIME2 NOT NULL,
    PaymentMethod NVARCHAR(50) NOT NULL CHECK (PaymentMethod IN (
        'Cash', 'BankTransfer', 'CreditCard', 'DebitCard', 'Pix', 'Check', 'Other'
    )),

    TransactionId NVARCHAR(100),
    Notes NVARCHAR(500),

    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy NVARCHAR(100),

    INDEX IX_Payments_InvoiceId (InvoiceId),
    INDEX IX_Payments_PaymentDate (PaymentDate DESC)
);
```

---

### InventoryItems (Itens de Estoque)

```sql
CREATE TABLE InventoryItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Category NVARCHAR(50),

    Unit NVARCHAR(20) NOT NULL DEFAULT 'Unidade',
    CurrentStock DECIMAL(18,2) NOT NULL DEFAULT 0 CHECK (CurrentStock >= 0),
    MinimumStock DECIMAL(18,2) NOT NULL DEFAULT 0,
    MaximumStock DECIMAL(18,2) NOT NULL DEFAULT 0,

    UnitCost DECIMAL(18,2) NOT NULL DEFAULT 0 CHECK (UnitCost >= 0),
    TotalValue AS (CurrentStock * UnitCost) PERSISTED,

    SupplierId INT,

    IsActive BIT NOT NULL DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    INDEX IX_InventoryItems_Name (Name),
    INDEX IX_InventoryItems_Category (Category),
    INDEX IX_InventoryItems_IsActive (IsActive)
);
```

---

### StockMovements (Movimentações de Estoque)

```sql
CREATE TABLE StockMovements (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ItemId INT NOT NULL FOREIGN KEY REFERENCES InventoryItems(Id),

    Type NVARCHAR(20) NOT NULL CHECK (Type IN ('Purchase', 'Usage', 'Adjustment', 'Return')),
    Quantity DECIMAL(18,2) NOT NULL CHECK (Quantity != 0),
    UnitCost DECIMAL(18,2) CHECK (UnitCost >= 0),
    Total AS (ABS(Quantity) * ISNULL(UnitCost, 0)) PERSISTED,

    MovementDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Notes NVARCHAR(500),

    UserId INT FOREIGN KEY REFERENCES Users(Id),

    INDEX IX_StockMovements_ItemId (ItemId),
    INDEX IX_StockMovements_Type (Type),
    INDEX IX_StockMovements_MovementDate (MovementDate DESC)
);
```

**Trigger para atualizar estoque**:

```sql
CREATE TRIGGER trg_StockMovements_UpdateInventory
ON StockMovements
AFTER INSERT
AS
BEGIN
    UPDATE InventoryItems
    SET CurrentStock = CurrentStock + i.Quantity,
        UpdatedAt = GETUTCDATE()
    FROM InventoryItems ii
    INNER JOIN inserted i ON ii.Id = i.ItemId;
END;
```

---

## Relacionamentos

| Tabela Pai | Tabela Filho | Tipo | FK |
|------------|--------------|------|-----|
| Users | Orders | 1:N | DriverId |
| Users | StockMovements | 1:N | UserId |
| Users | Payments | 1:N | CreatedBy |
| Clients | Orders | 1:N | ClientId |
| Clients | Invoices | 1:N | ClientId |
| Orders | OrderItems | 1:N | OrderId (CASCADE) |
| Orders | OrderStatusLogs | 1:N | OrderId (CASCADE) |
| Orders | Invoices | 1:1 | OrderId |
| ServiceItems | OrderItems | 1:N | ServiceItemId |
| Invoices | Payments | 1:N | InvoiceId |
| InventoryItems | StockMovements | 1:N | ItemId |

---

## Índices

### Índices de Performance

```sql
-- Busca de ordens por cliente e período
CREATE INDEX IX_Orders_ClientId_CollectionDate
ON Orders(ClientId, CollectionDate DESC);

-- Dashboard: ordens recentes por status
CREATE INDEX IX_Orders_Status_CreatedAt
ON Orders(Status, CreatedAt DESC);

-- Relatórios financeiros
CREATE INDEX IX_Invoices_ClientId_IssueDate
ON Invoices(ClientId, IssueDate DESC);

-- Busca de pagamentos por período
CREATE INDEX IX_Payments_PaymentDate
ON Payments(PaymentDate DESC)
INCLUDE (InvoiceId, Amount, PaymentMethod);
```

---

## Stored Procedures

### sp_GetDashboardMetrics

```sql
CREATE PROCEDURE sp_GetDashboardMetrics
    @StartDate DATETIME2,
    @EndDate DATETIME2
AS
BEGIN
    SELECT
        -- Total de ordens
        COUNT(*) AS TotalOrders,
        COUNT(CASE WHEN Status NOT IN ('Delivered', 'Cancelled') THEN 1 END) AS PendingOrders,
        COUNT(CASE WHEN Status = 'Delivered' THEN 1 END) AS CompletedOrders,
        COUNT(CASE WHEN Status = 'Cancelled' THEN 1 END) AS CancelledOrders,

        -- Financeiro
        SUM(TotalAmount) AS TotalRevenue,
        AVG(TotalAmount) AS AverageOrderValue,

        -- Clientes ativos no período
        COUNT(DISTINCT ClientId) AS ActiveClients
    FROM Orders
    WHERE CreatedAt BETWEEN @StartDate AND @EndDate;
END;
```

---

### sp_CreateOrder

```sql
CREATE PROCEDURE sp_CreateOrder
    @ClientId INT,
    @RequestDate DATETIME2,
    @CollectionDate DATETIME2,
    @DeliveryDate DATETIME2,
    @DriverId INT,
    @Notes NVARCHAR(MAX),
    @Items NVARCHAR(MAX), -- JSON: [{"serviceItemId": 1, "quantity": 10, "unitPrice": 5.0}]
    @CreatedBy NVARCHAR(100),
    @OrderId INT OUTPUT
AS
BEGIN
    BEGIN TRANSACTION;

    -- Criar ordem
    INSERT INTO Orders (ClientId, RequestDate, CollectionDate, DeliveryDate, DriverId, Notes, Status, CreatedBy)
    VALUES (@ClientId, @RequestDate, @CollectionDate, @DeliveryDate, @DriverId, @Notes, 'Requested', @CreatedBy);

    SET @OrderId = SCOPE_IDENTITY();

    -- Inserir itens
    INSERT INTO OrderItems (OrderId, ServiceItemId, Quantity, UnitPrice)
    SELECT @OrderId, serviceItemId, quantity, unitPrice
    FROM OPENJSON(@Items)
    WITH (
        serviceItemId INT,
        quantity DECIMAL(18,2),
        unitPrice DECIMAL(18,2)
    );

    -- Atualizar total
    UPDATE Orders
    SET TotalAmount = (SELECT SUM(Subtotal) FROM OrderItems WHERE OrderId = @OrderId)
    WHERE Id = @OrderId;

    COMMIT TRANSACTION;
END;
```

---

## Views

### vw_OrdersWithDetails

```sql
CREATE VIEW vw_OrdersWithDetails AS
SELECT
    o.Id,
    o.OrderNumber,
    o.Status,
    o.RequestDate,
    o.CollectionDate,
    o.DeliveryDate,
    o.TotalAmount,
    o.CreatedAt,

    -- Cliente
    c.Id AS ClientId,
    c.Name AS ClientName,
    c.Document AS ClientDocument,
    c.Phone AS ClientPhone,

    -- Motorista
    u.Id AS DriverId,
    u.Name AS DriverName,
    u.Phone AS DriverPhone,

    -- Métricas
    (SELECT COUNT(*) FROM OrderItems WHERE OrderId = o.Id) AS ItemCount,
    CASE
        WHEN o.DeliveryDate < GETDATE() AND o.Status NOT IN ('Delivered', 'Cancelled')
        THEN 1
        ELSE 0
    END AS IsOverdue

FROM Orders o
INNER JOIN Clients c ON o.ClientId = c.Id
LEFT JOIN Users u ON o.DriverId = u.Id;
```

---

### vw_ClientStatistics

```sql
CREATE VIEW vw_ClientStatistics AS
SELECT
    c.Id,
    c.Name,
    c.Document,
    c.IsActive,

    COUNT(o.Id) AS TotalOrders,
    COUNT(CASE WHEN o.Status = 'Delivered' THEN 1 END) AS CompletedOrders,
    COUNT(CASE WHEN o.Status IN ('Requested', 'Collected', 'InWashing', 'Drying', 'Ironing', 'Packed', 'Ready', 'InRoute') THEN 1 END) AS PendingOrders,
    SUM(o.TotalAmount) AS TotalRevenue,
    AVG(o.TotalAmount) AS AverageOrderValue,
    MAX(o.CreatedAt) AS LastOrderDate

FROM Clients c
LEFT JOIN Orders o ON c.Id = o.ClientId
GROUP BY c.Id, c.Name, c.Document, c.IsActive;
```

---

## Migrations

### Migration: Initial Schema (001)

```sql
-- 001_InitialSchema.sql
-- Cria todas as tabelas principais
-- Executar em ordem: Users → Clients → ServiceItems → Orders → OrderItems → OrderStatusLogs
```

### Migration: Add Invoices (002)

```sql
-- 002_AddInvoices.sql
CREATE TABLE Invoices (...);
CREATE TABLE Payments (...);
```

### Migration: Add Inventory (003)

```sql
-- 003_AddInventory.sql
CREATE TABLE InventoryItems (...);
CREATE TABLE StockMovements (...);
CREATE TRIGGER trg_StockMovements_UpdateInventory (...);
```

---

## Scripts de Seed

### Seed: Users

```sql
INSERT INTO Users (Name, Email, PasswordHash, Role)
VALUES
('Administrador', 'admin@alvura.com.br', '$2a$11$hashed_password', 'Admin'),
('Gerente', 'gerente@alvura.com.br', '$2a$11$hashed_password', 'Manager'),
('Operador', 'operador@alvura.com.br', '$2a$11$hashed_password', 'Operator');
```

### Seed: ServiceItems

```sql
INSERT INTO ServiceItems (Name, Category, UnitPrice, Unit)
VALUES
('Lençol Solteiro', 'Cama', 8.50, 'Peça'),
('Lençol Casal', 'Cama', 12.00, 'Peça'),
('Toalha de Banho', 'Banho', 5.00, 'Peça'),
('Toalha de Rosto', 'Banho', 3.50, 'Peça'),
('Fronha', 'Cama', 3.00, 'Peça');
```

---

## Backup e Manutenção

```sql
-- Backup completo
BACKUP DATABASE AlvuraDB
TO DISK = 'C:\Backups\AlvuraDB_Full.bak'
WITH INIT, COMPRESSION;

-- Backup incremental (diário)
BACKUP DATABASE AlvuraDB
TO DISK = 'C:\Backups\AlvuraDB_Diff.bak'
WITH DIFFERENTIAL, COMPRESSION;

-- Rebuild índices (semanal)
ALTER INDEX ALL ON Orders REBUILD;
ALTER INDEX ALL ON OrderItems REBUILD;

-- Update statistics (diário)
UPDATE STATISTICS Orders;
UPDATE STATISTICS OrderItems;
```

---

<div align="center">

**Schema do Banco de Dados - Alvura System**

[⬆ Voltar ao README](../README.md)

</div>
