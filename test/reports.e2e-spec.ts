import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Prisma } from '@prisma/client';
import { createTestApp } from './helpers/create-test-app';
import { buildAdminToken } from './helpers/jwt.helper';
import { PrismaMock } from './helpers/prisma.mock';

function gql(app: INestApplication, query: string, token: string) {
  return request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${token}`)
    .send({ query });
}

describe('Reports (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaMock;
  let token: string;

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    token = buildAdminToken();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('incomeReport returns totals by type and grand total', async () => {
    prisma.income.groupBy.mockResolvedValue([
      { type: 'TITHE', _sum: { amount: new Prisma.Decimal('1000.00') } },
      { type: 'OFFERING', _sum: { amount: new Prisma.Decimal('500.00') } },
    ]);
    prisma.income.aggregate.mockResolvedValue({ _sum: { amount: new Prisma.Decimal('1500.00') } });

    const query = `
      query {
        incomeReport {
          byType {
            type
            total
          }
          grandTotal
        }
      }
    `;

    const res = await gql(app, query, token);

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.incomeReport.byType).toHaveLength(2);
    expect(res.body.data.incomeReport.grandTotal).toBe('1500');
  });

  it('expenseReport returns totals by fund and category', async () => {
    prisma.expense.groupBy
      .mockResolvedValueOnce([
        { fundSource: 'TITHE', _sum: { amount: new Prisma.Decimal('200.00') } },
      ])
      .mockResolvedValueOnce([
        { category: 'Servicios', _sum: { amount: new Prisma.Decimal('200.00') } },
      ]);
    prisma.expense.aggregate.mockResolvedValue({ _sum: { amount: new Prisma.Decimal('200.00') } });

    const query = `
      query {
        expenseReport {
          byFund {
            fundSource
            total
          }
          byCategory {
            category
            total
          }
          grandTotal
        }
      }
    `;

    const res = await gql(app, query, token);

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.expenseReport.byFund).toHaveLength(1);
    expect(res.body.data.expenseReport.byCategory).toHaveLength(1);
    expect(res.body.data.expenseReport.grandTotal).toBe('200');
  });

  it('balanceReport computes net per fund', async () => {
    // incomeByType is called by balanceReport handler
    prisma.income.groupBy.mockResolvedValue([
      { type: 'TITHE', _sum: { amount: new Prisma.Decimal('1000.00') } },
      { type: 'OFFERING', _sum: { amount: new Prisma.Decimal('500.00') } },
    ]);
    prisma.income.aggregate.mockResolvedValue({ _sum: { amount: new Prisma.Decimal('1500.00') } });

    // expenseByFund is called by balanceReport handler
    prisma.expense.groupBy.mockResolvedValue([
      { fundSource: 'TITHE', _sum: { amount: new Prisma.Decimal('200.00') } },
      { fundSource: 'NON_TITHE', _sum: { amount: new Prisma.Decimal('100.00') } },
    ]);
    prisma.expense.aggregate.mockResolvedValue({ _sum: { amount: new Prisma.Decimal('300.00') } });

    const query = `
      query {
        balanceReport {
          byFund {
            fund
            totalIncome
            totalExpense
            net
          }
          totalIncome
          totalExpense
          netBalance
        }
      }
    `;

    const res = await gql(app, query, token);

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.balanceReport.byFund).toHaveLength(2);

    const titheRow = res.body.data.balanceReport.byFund.find(
      (r: { fund: string }) => r.fund === 'TITHE',
    );
    expect(titheRow).toBeDefined();
    expect(titheRow.net).toBe('800'); // 1000 - 200

    expect(res.body.data.balanceReport.netBalance).toBe('1200'); // 1500 - 300
  });
});
