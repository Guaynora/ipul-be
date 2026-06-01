# SESSION HANDOFF — ipul-be

> Última actualización: 2026-05-19

Este archivo es un resumen portable para continuar el proyecto desde otra máquina/sesión.

> Seguimiento operativo rapido: ver [`PROJECT_STATUS.md`](./PROJECT_STATUS.md).

## 1) Estado actual

- Proyecto: backend NestJS para gestión de iglesia.
- Flujo: SDD por slices (`stacked-to-main`).
- PR1: ✅ completado y mergeado a `main`.
- PR2: ✅ creado (parishioners + incomes + refactor clean con ports/adapters).
  - URL: https://github.com/Guaynora/ipul-be/pull/2

## 2) Decisiones funcionales clave

1. Tipos de ingreso soportados:
   - `OFFERING`
   - `TITHE`
   - `SALE_OTHER`

2. Regla crítica de `parishionerId`:
   - Solo permitido para `TITHE`.
   - Si llega en `OFFERING` o `SALE_OTHER` => error de validación (422).

3. Diezmo anónimo:
   - Permitido (`parishionerId = null`).

4. Descuentos de diezmo:
   - Variables en el tiempo (pueden cambiar cantidad/tipo de descuento por periodo).
   - Cambios aplican solo a nuevos registros.
   - Históricos deben quedar inmutables vía snapshot/versionado.

## 3) Decisiones técnicas

- Stack: NestJS + Prisma + PostgreSQL.
- Arquitectura: Clean Architecture + CQRS.
- API:
  - Auth por REST.
  - Negocio por GraphQL code-first.
- Testing:
  - Unit tests co-localizados en carpetas `__test__` dentro de `src/**`.
- Convención de commits:
  - Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).

## 4) Estructura (idea guía)

Cada módulo con capas internas:

- `domain/`
- `application/`
- `infrastructure/`
- `presentation/`

En PR2 se reforzó esto moviendo acceso a Prisma a `infrastructure` (adapters), y handlers de `application` quedaron contra `ports`.

## 5) Comandos útiles

```bash
npm run lint
npm run build
npm run test
npm run test:cov

npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:studio
```

## 6) Qué sigue (PR3)

Siguiente slice recomendado:

1. `expenses` module (egresos) con `fundSource` (`TITHE` / `NON_TITHE`).
2. `tithe-discounts`:
   - ciclo de vida de reglas/versiones.
   - snapshot inmutable al crear registro.
3. `reports`:
   - agregaciones separadas por fondo/tipo/categoría/fecha.
4. pruebas unitarias de la lógica de versionado y reportes.

## 7) Git / ramas

- Estrategia elegida: `stacked-to-main`.
- Flujo:
  1. Crear rama del siguiente slice desde `main` actualizado.
  2. Implementar + lint/build/test.
  3. PR hacia `main`.

## 8) Nota sobre Engram

Si en la otra máquina no tienes el mismo backend/contexto de Engram, este archivo funciona como fuente de verdad rápida para retomar sin perder contexto.
