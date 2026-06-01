# PROJECT STATUS — ipul-be

> Ultima actualizacion: 2026-05-31

Guia corta para retomar el proyecto rapidamente en otra maquina/sesion.

## Hecho (estado actual)

- [x] PR1 integrado en `main` (bootstrap, auth REST, guardas/validacion base).
- [x] PR2 probablemente integrado (parishioners + incomes + estructura clean con ports/adapters).
- [x] Modulo `expenses` implementado en `src` (slice base PR3).
- [x] Regla funcional vigente: `parishionerId` solo permitido para `TITHE`.
- [x] Convencion de arquitectura mantenida: capas `domain/application/infrastructure/presentation` por modulo.

## Falta (brechas detectadas)

- [ ] Modulo `tithe-discounts` en `src`.
- [ ] Modulo `reports` en `src`.
- [ ] Endpoints/queries y casos de prueba de PR3.
- [ ] Verificacion explicita de coherencia Prisma (schema vs migraciones aplicadas).

## Plan PR3 por slices (priorizado)

1. **Slice 1 — `expenses` (prioridad alta)**
   - Definir casos de uso base (crear/listar) y validaciones.
   - Separar por `fundSource` (`TITHE` / `NON_TITHE`).
   - Dejar pruebas unitarias del dominio.

2. **Slice 2 — `tithe-discounts` (prioridad alta)**
   - Gestionar versionado/ciclo de vida de reglas.
   - Asegurar snapshot inmutable al registrar movimientos.
   - Cubrir edge cases de cambios en el tiempo.

3. **Slice 3 — `reports` (prioridad media-alta)**
   - Agregaciones por fondo/tipo/categoria/fecha.
   - Consultas enfocadas en lectura (sin romper limites de capas).
   - Pruebas de consistencia de calculos.

4. **Slice 4 — hardening (prioridad media)**
   - End-to-end minimo de flujos PR3.
   - Ajustes de docs y criterios de aceptacion.

## Comandos de verificacion

```bash
pnpm install
npm run lint
npm run build
npm run test
npm run test:cov
npm run prisma:generate
npm run prisma:migrate:dev
```

## Riesgos y ambiguedades

- Riesgo de desalineacion Prisma: el codigo puede no coincidir con migraciones locales si PR2/PR3 se aplicaron parcialmente.
- PR2 marcado como "probablemente integrado": confirmar con historial Git y estado real de `src`.
- Ambiguedad funcional pendiente: alcance exacto de reportes (campos, filtros, granularidad temporal).
- Riesgo de deuda de pruebas: versionado de descuentos y agregaciones requieren cobertura antes de cerrar PR3.

## Plantilla de cierre por slice (copiar/pegar)

Usar esta plantilla al cerrar cada PR/slice para mantener continuidad entre sesiones y maquinas.

```md
### Cierre Slice <N> — <nombre>

**Fecha**: YYYY-MM-DD  
**Rama/PR**: <branch> / <url-pr>

#### Alcance completado
- [ ] <capacidad 1>
- [ ] <capacidad 2>
- [ ] <capacidad 3>

#### Verificacion tecnica
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run test`
- [ ] `npm run test:cov` (si aplica)
- [ ] `npm run prisma:generate` (si aplica)
- [ ] `npm run prisma:migrate:dev` (si aplica)

#### Evidencia (archivos clave)
- `src/<modulo>/...` — <que se implemento>
- `prisma/schema.prisma` — <cambio de modelo>
- `src/**/__test__/*.spec.ts` — <pruebas agregadas>

#### Riesgos / deuda pendiente
- <riesgo 1>
- <riesgo 2>

#### Siguiente paso recomendado
- <siguiente slice o ajuste inmediato>
```

> Regla operativa: al cerrar un slice, actualiza tambien las secciones **Hecho** y **Falta** de este documento.

## Referencias

- Handoff de sesion: `SESSION_HANDOFF.md`
- Punto de entrada general: `README.md`
