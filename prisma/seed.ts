import { PrismaClient, IncomeType, FundSource, DiscountStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function date(y: number, m: number, d: number) {
  return new Date(Date.UTC(y, m - 1, d));
}

function dec(n: string) {
  return new Prisma.Decimal(n);
}

// ---------------------------------------------------------------------------
// data
// ---------------------------------------------------------------------------

const ADMIN_EMAIL = 'admin@ipul.local';
// bcrypt hash of "admin123" (cost 10) — pre-computed, no runtime dependency
const ADMIN_HASH =
  '$2b$10$7Yd6BGQE9f4JXKPF5tEgHOjV2rVj0k1NvxQKSiDq4j5/xvDfRlFOi';

const parishioners = [
  { name: 'Juan Carlos Mamani Quispe',     email: 'jcmamani@gmail.com',   phone: '71234567', address: 'Av. Montes 123, La Paz',       baptized: true  },
  { name: 'María Elena Flores Condori',    email: 'mflores@gmail.com',    phone: '72345678', address: 'Calle Murillo 45, La Paz',      baptized: true  },
  { name: 'Roberto Fernández Arce',        email: null,                   phone: '73456789', address: 'Villa Copacabana, La Paz',      baptized: true  },
  { name: 'Ana Lucía Torrez Lima',         email: 'atorrez@hotmail.com',  phone: '74567890', address: 'Sopocachi, La Paz',             baptized: false },
  { name: 'Carlos Alberto Mamani Choque',  email: null,                   phone: null,       address: 'El Alto, La Paz',               baptized: true  },
  { name: 'Rosa Isabel Gutierrez Paz',     email: 'rosaig@gmail.com',     phone: '75678901', address: 'Miraflores, La Paz',            baptized: true  },
  { name: 'Pedro Antonio Vargas Cruz',     email: null,                   phone: '76789012', address: 'San Pedro, La Paz',             baptized: false },
  { name: 'Claudia Beatriz Quispe Mamani', email: 'cquispe@gmail.com',    phone: '77890123', address: 'Tembladerani, La Paz',          baptized: true  },
  { name: 'Fernando José Rivas Soliz',     email: null,                   phone: '78901234', address: 'Obrajes, La Paz',               baptized: true  },
  { name: 'Yolanda Carmen Ticona Condori', email: 'yticona@hotmail.com',  phone: null,       address: 'Chasquipampa, La Paz',          baptized: true  },
  { name: 'Miguel Ángel Herrera Vásquez',  email: 'mherrera@gmail.com',   phone: '79012345', address: 'Calacoto, La Paz',              baptized: false },
  { name: 'Silvia Patricia Chuquimia',     email: null,                   phone: '70123456', address: 'Alto Obrajes, La Paz',          baptized: true  },
  { name: 'Alejandro René Mendoza Aliaga', email: 'amendoza@gmail.com',   phone: '71122334', address: 'Achumani, La Paz',              baptized: true  },
  { name: 'Verónica Susana Rojas Chávez',  email: 'vrojas@hotmail.com',   phone: null,       address: 'Irpavi, La Paz',                baptized: false },
  { name: 'Daniel Eduardo Poma Ticona',    email: null,                   phone: '72233445', address: 'Ciudad Satélite, El Alto',      baptized: true  },
];

const discountRulesV1 = { percentage: 10, description: 'Descuento inicial de diezmo 10%' };
const discountRulesV2 = { percentage: 12, description: 'Descuento actualizado de diezmo 12%' };

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  console.log('🌱 Seeding database...');

  // ------------------------------------------------------------------
  // clean (FK order: Income → Parishioner, DiscountVersion; then the rest)
  // ------------------------------------------------------------------
  await prisma.income.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.parishioner.deleteMany();
  await prisma.discountVersion.deleteMany();
  await prisma.adminUser.deleteMany();

  // ------------------------------------------------------------------
  // admin user
  // ------------------------------------------------------------------
  await prisma.adminUser.create({
    data: { email: ADMIN_EMAIL, passwordHash: ADMIN_HASH },
  });
  console.log('  ✓ AdminUser');

  // ------------------------------------------------------------------
  // parishioners
  // ------------------------------------------------------------------
  const created = await Promise.all(
    parishioners.map((p) => prisma.parishioner.create({ data: p })),
  );
  console.log(`  ✓ ${created.length} Parishioners`);

  // ------------------------------------------------------------------
  // discount versions
  // ------------------------------------------------------------------
  const v1 = await prisma.discountVersion.create({
    data: {
      version: 1,
      status: DiscountStatus.RETIRED,
      effectiveFrom: date(2025, 1, 1),
      rules: discountRulesV1,
      createdBy: ADMIN_EMAIL,
      activatedAt: date(2025, 1, 1),
    },
  });

  const v2 = await prisma.discountVersion.create({
    data: {
      version: 2,
      status: DiscountStatus.ACTIVE,
      effectiveFrom: date(2026, 1, 1),
      rules: discountRulesV2,
      createdBy: ADMIN_EMAIL,
      activatedAt: date(2026, 1, 1),
    },
  });
  console.log('  ✓ 2 DiscountVersions (v1 RETIRED, v2 ACTIVE)');

  // ------------------------------------------------------------------
  // incomes
  // ------------------------------------------------------------------

  // TITHE — 16 entries, linked to parishioners with discount snapshot
  const titheData: { parishioner: (typeof created)[0]; amount: string; dateVal: Date; version: typeof v1 | typeof v2 }[] = [
    { parishioner: created[0],  amount: '350.00', dateVal: date(2025, 7, 5),   version: v1 },
    { parishioner: created[1],  amount: '420.00', dateVal: date(2025, 8, 3),   version: v1 },
    { parishioner: created[2],  amount: '280.00', dateVal: date(2025, 9, 7),   version: v1 },
    { parishioner: created[3],  amount: '500.00', dateVal: date(2025, 10, 5),  version: v1 },
    { parishioner: created[5],  amount: '320.00', dateVal: date(2025, 11, 2),  version: v1 },
    { parishioner: created[7],  amount: '450.00', dateVal: date(2025, 12, 7),  version: v1 },
    { parishioner: created[9],  amount: '200.00', dateVal: date(2025, 12, 14), version: v1 },
    { parishioner: created[0],  amount: '350.00', dateVal: date(2026, 1, 4),   version: v2 },
    { parishioner: created[1],  amount: '420.00', dateVal: date(2026, 2, 1),   version: v2 },
    { parishioner: created[2],  amount: '300.00', dateVal: date(2026, 2, 15),  version: v2 },
    { parishioner: created[4],  amount: '180.00', dateVal: date(2026, 3, 2),   version: v2 },
    { parishioner: created[6],  amount: '260.00', dateVal: date(2026, 3, 16),  version: v2 },
    { parishioner: created[8],  amount: '390.00', dateVal: date(2026, 4, 6),   version: v2 },
    { parishioner: created[10], amount: '310.00', dateVal: date(2026, 5, 4),   version: v2 },
    { parishioner: created[12], amount: '470.00', dateVal: date(2026, 5, 18),  version: v2 },
    { parishioner: created[14], amount: '220.00', dateVal: date(2026, 6, 1),   version: v2 },
  ];

  await Promise.all(
    titheData.map(({ parishioner, amount, dateVal, version }) =>
      prisma.income.create({
        data: {
          type: IncomeType.TITHE,
          amount: dec(amount),
          date: dateVal,
          parishionerId: parishioner.id,
          discountVersionId: version.id,
          discountSnapshot: version.rules as Prisma.InputJsonValue,
          createdBy: ADMIN_EMAIL,
        },
      }),
    ),
  );

  // OFFERING — 12 entries, no parishioner
  const offeringAmounts = [
    { amount: '1850.00', dateVal: date(2025, 7, 6)   },
    { amount: '2100.00', dateVal: date(2025, 8, 3)   },
    { amount: '1750.00', dateVal: date(2025, 9, 7)   },
    { amount: '1920.00', dateVal: date(2025, 10, 5)  },
    { amount: '2350.00', dateVal: date(2025, 11, 2)  },
    { amount: '3100.00', dateVal: date(2025, 12, 7)  },
    { amount: '2800.00', dateVal: date(2025, 12, 28) },
    { amount: '2200.00', dateVal: date(2026, 1, 5)   },
    { amount: '1980.00', dateVal: date(2026, 2, 2)   },
    { amount: '2450.00', dateVal: date(2026, 3, 2)   },
    { amount: '2700.00', dateVal: date(2026, 4, 6)   },
    { amount: '2950.00', dateVal: date(2026, 5, 4)   },
  ];

  await Promise.all(
    offeringAmounts.map(({ amount, dateVal }) =>
      prisma.income.create({
        data: {
          type: IncomeType.OFFERING,
          amount: dec(amount),
          date: dateVal,
          description: 'Ofrenda dominical',
          createdBy: ADMIN_EMAIL,
        },
      }),
    ),
  );

  // SALE_OTHER — 5 entries
  const saleData = [
    { amount: '850.00',  dateVal: date(2025, 8, 20),  description: 'Venta de Biblias y materiales' },
    { amount: '450.00',  dateVal: date(2025, 11, 15), description: 'Venta de artículos de bazar navideño' },
    { amount: '1200.00', dateVal: date(2025, 12, 20), description: 'Venta de alimentos en evento anual' },
    { amount: '320.00',  dateVal: date(2026, 3, 22),  description: 'Venta de publicaciones y devocionales' },
    { amount: '680.00',  dateVal: date(2026, 5, 10),  description: 'Venta de artículos en feria misionera' },
  ];

  await Promise.all(
    saleData.map(({ amount, dateVal, description }) =>
      prisma.income.create({
        data: {
          type: IncomeType.SALE_OTHER,
          amount: dec(amount),
          date: dateVal,
          description,
          createdBy: ADMIN_EMAIL,
        },
      }),
    ),
  );

  console.log('  ✓ 33 Incomes (16 TITHE · 12 OFFERING · 5 SALE_OTHER)');

  // ------------------------------------------------------------------
  // expenses
  // ------------------------------------------------------------------
  const expenses = [
    // NON_TITHE — servicios básicos
    { description: 'Factura de luz DELAPAZ',     amount: '320.00',  date: date(2025, 7,  10), category: 'Servicios Básicos',  fundSource: FundSource.NON_TITHE },
    { description: 'Factura de agua EPSAS',       amount: '85.00',   date: date(2025, 8,  10), category: 'Servicios Básicos',  fundSource: FundSource.NON_TITHE },
    { description: 'Internet y telefonía',        amount: '250.00',  date: date(2025, 9,  5),  category: 'Servicios Básicos',  fundSource: FundSource.NON_TITHE },
    { description: 'Factura de luz DELAPAZ',      amount: '290.00',  date: date(2025, 10, 10), category: 'Servicios Básicos',  fundSource: FundSource.NON_TITHE },
    { description: 'Factura de luz DELAPAZ',      amount: '310.00',  date: date(2026, 1,  10), category: 'Servicios Básicos',  fundSource: FundSource.NON_TITHE },
    { description: 'Internet y telefonía',        amount: '250.00',  date: date(2026, 3,  5),  category: 'Servicios Básicos',  fundSource: FundSource.NON_TITHE },
    // NON_TITHE — mantenimiento
    { description: 'Pintura interior del templo', amount: '1800.00', date: date(2025, 9,  15), category: 'Mantenimiento',      fundSource: FundSource.NON_TITHE },
    { description: 'Reparación de baños',         amount: '650.00',  date: date(2025, 11, 20), category: 'Mantenimiento',      fundSource: FundSource.NON_TITHE },
    { description: 'Compra de sillas nuevas',     amount: '2400.00', date: date(2026, 2,  14), category: 'Mantenimiento',      fundSource: FundSource.NON_TITHE },
    { description: 'Reparación sistema eléctrico',amount: '480.00',  date: date(2026, 4,  20), category: 'Mantenimiento',      fundSource: FundSource.NON_TITHE },
    // NON_TITHE — materiales
    { description: 'Biblias para nuevos creyentes',amount: '560.00', date: date(2025, 8,  25), category: 'Materiales',         fundSource: FundSource.NON_TITHE },
    { description: 'Material para escuela dominical',amount:'340.00',date: date(2025, 10, 18), category: 'Materiales',         fundSource: FundSource.NON_TITHE },
    { description: 'Cuadernos y papelería',       amount: '180.00',  date: date(2026, 3,  10), category: 'Materiales',         fundSource: FundSource.NON_TITHE },
    // TITHE — misiones
    { description: 'Apoyo misionero zona norte',  amount: '1500.00', date: date(2025, 7,  28), category: 'Misiones',           fundSource: FundSource.TITHE     },
    { description: 'Apoyo misionero zona sur',    amount: '1500.00', date: date(2025, 10, 28), category: 'Misiones',           fundSource: FundSource.TITHE     },
    { description: 'Apoyo misionero zona norte',  amount: '1500.00', date: date(2026, 1,  28), category: 'Misiones',           fundSource: FundSource.TITHE     },
    { description: 'Fondo misiones internacionales',amount:'2000.00',date: date(2026, 4,  28), category: 'Misiones',           fundSource: FundSource.TITHE     },
    // TITHE — salarios
    { description: 'Honorario pastor principal',  amount: '3500.00', date: date(2025, 7,  30), category: 'Salarios',           fundSource: FundSource.TITHE     },
    { description: 'Honorario pastor principal',  amount: '3500.00', date: date(2025, 8,  30), category: 'Salarios',           fundSource: FundSource.TITHE     },
    { description: 'Honorario pastor principal',  amount: '3500.00', date: date(2025, 9,  30), category: 'Salarios',           fundSource: FundSource.TITHE     },
    { description: 'Honorario pastor principal',  amount: '3500.00', date: date(2025, 10, 30), category: 'Salarios',           fundSource: FundSource.TITHE     },
    { description: 'Honorario pastor principal',  amount: '3500.00', date: date(2025, 11, 30), category: 'Salarios',           fundSource: FundSource.TITHE     },
    { description: 'Honorario pastor principal',  amount: '3800.00', date: date(2025, 12, 30), category: 'Salarios',           fundSource: FundSource.TITHE     },
    { description: 'Honorario pastor principal',  amount: '3800.00', date: date(2026, 1,  31), category: 'Salarios',           fundSource: FundSource.TITHE     },
    { description: 'Honorario pastor principal',  amount: '3800.00', date: date(2026, 2,  28), category: 'Salarios',           fundSource: FundSource.TITHE     },
    { description: 'Honorario pastor principal',  amount: '3800.00', date: date(2026, 3,  31), category: 'Salarios',           fundSource: FundSource.TITHE     },
    { description: 'Honorario pastor principal',  amount: '3800.00', date: date(2026, 4,  30), category: 'Salarios',           fundSource: FundSource.TITHE     },
    { description: 'Honorario pastor principal',  amount: '3800.00', date: date(2026, 5,  31), category: 'Salarios',           fundSource: FundSource.TITHE     },
    // TITHE — eventos
    { description: 'Conferencia anual de jóvenes',amount: '2200.00', date: date(2025, 11, 8),  category: 'Eventos',            fundSource: FundSource.TITHE     },
    { description: 'Convención regional IPUL',    amount: '3500.00', date: date(2026, 4,  12), category: 'Eventos',            fundSource: FundSource.TITHE     },
  ];

  await Promise.all(
    expenses.map((e) =>
      prisma.expense.create({
        data: {
          description: e.description,
          amount: dec(e.amount),
          date: e.date,
          category: e.category,
          fundSource: e.fundSource,
          createdBy: ADMIN_EMAIL,
        },
      }),
    ),
  );

  console.log(`  ✓ ${expenses.length} Expenses (13 NON_TITHE · ${expenses.length - 13} TITHE)`);

  // ------------------------------------------------------------------
  // summary
  // ------------------------------------------------------------------
  const counts = await Promise.all([
    prisma.adminUser.count(),
    prisma.parishioner.count(),
    prisma.discountVersion.count(),
    prisma.income.count(),
    prisma.expense.count(),
  ]);
  console.log('\n✅ Done.');
  console.log(`   AdminUsers: ${counts[0]}  |  Parishioners: ${counts[1]}  |  DiscountVersions: ${counts[2]}  |  Incomes: ${counts[3]}  |  Expenses: ${counts[4]}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
