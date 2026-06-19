# Architecture — ipul-be

> Last updated: 2026-06-13 · PR3 complete (all 4 slices merged)

Living document. Updated at the end of each slice.

---

## Module map

```mermaid
graph TD
  subgraph API["NestJS Application"]
    Auth["auth\n─────\nREST POST /auth/login\nJWT + ADMIN guard"]
    Parishioners["parishioners\n─────\nCRUD feligreses"]
    Incomes["incomes\n─────\nRegistro de ingresos"]
    Expenses["expenses\n─────\nRegistro de egresos"]
    TitheDiscounts["tithe-discounts\n─────\nVersionado de reglas\nde descuento"]
    Reports["reports\n─────\nAgregaciones\nincomeReport · expenseReport\nbalanceReport"]
  end

  subgraph Infra["Infrastructure"]
    Prisma[("PostgreSQL\n(via Prisma)")]
  end

  Auth --> Prisma
  Parishioners --> Prisma
  Incomes --> Prisma
  Incomes -.->|"valida existencia\n(port secundario)"| Parishioners
  Expenses --> Prisma
  TitheDiscounts --> Prisma
  Reports -.->|"groupBy + aggregate\n(read-only)"| Prisma
```

---

## Data model (ERD)

```mermaid
erDiagram
  AdminUser {
    uuid   id
    string email
    string passwordHash
    enum   role
  }

  Parishioner {
    uuid    id
    string  name
    string  email
    string  phone
    string  address
    boolean baptized
  }

  Income {
    uuid     id
    enum     type
    decimal  amount
    datetime date
    string   description
    uuid     parishionerId
    uuid     discountVersionId
    json     discountSnapshot
    string   createdBy
  }

  Expense {
    uuid     id
    string   description
    decimal  amount
    datetime date
    string   category
    enum     fundSource
    string   createdBy
  }

  DiscountVersion {
    uuid     id
    int      version
    enum     status
    datetime effectiveFrom
    json     rules
    string   createdBy
    datetime activatedAt
  }

  Parishioner    ||--o{ Income          : "parishioner (TITHE only)"
  DiscountVersion ||--o{ Income         : "discount snapshot"
```

---

## GraphQL API surface

```mermaid
mindmap
  root((GraphQL API))
    parishioners
      Q parishioners
      Q parishioner(id)
      M createParishioner(input)
      M updateParishioner(id, input)
      M deleteParishioner(id)
    incomes
      Q incomes
      M createIncome(input, createdBy)
    expenses
      Q expenses
      M createExpense(input, createdBy)
    tithe-discounts
      Q titheDiscounts
      Q activeTitheDiscount
      M createTitheDiscount(input, createdBy)
      M activateTitheDiscount(id)
    reports
      Q incomeReport(filter?)
      Q expenseReport(filter?)
      Q balanceReport(filter?)
```

> All GraphQL operations require `Authorization: Bearer <JWT>` with `ADMIN` role.
> Auth is a separate REST endpoint: `POST /auth/login`.

---

## Clean architecture layers (per module)

```mermaid
graph LR
  subgraph Module["Any module (e.g. expenses)"]
    direction TB
    P["presentation\nResolver · Input DTO · Type"]
    A["application\nCommands · Queries · Ports"]
    D["domain\nEntity interface"]
    I["infrastructure\nPrisma repository"]
  end

  P --> A
  A --> D
  I --> A
  I --> D

  style P fill:#dbeafe
  style A fill:#dcfce7
  style D fill:#fef9c3
  style I fill:#fce7f3
```

**Dependency rule**: arrows point inward only. Infrastructure implements the port defined by application — never the other way around.

---

## DiscountVersion lifecycle

```mermaid
stateDiagram-v2
  [*] --> DRAFT : createTitheDiscount
  DRAFT --> ACTIVE : activateTitheDiscount\n(atomic — prev ACTIVE → RETIRED)
  ACTIVE --> RETIRED : superseded by new activation
  DRAFT --> [*] : (never activated)

  note right of ACTIVE
    Only one ACTIVE at a time.
    Linked incomes carry an immutable
    discountSnapshot for historical accuracy.
  end note
```

---

## Slice progress

| Slice | Module | Status |
|-------|--------|--------|
| PR1 | auth, bootstrap, Prisma | ✅ merged |
| PR2 | parishioners, incomes | ✅ merged |
| PR3 — Slice 1 | expenses | ✅ merged |
| PR3 — Slice 2 | tithe-discounts | ✅ PR open (#4) |
| PR3 — Slice 3 | reports | ✅ PR open |
| PR3 — Slice 4 | hardening (e2e, docs) | ✅ PR open (#6) |
