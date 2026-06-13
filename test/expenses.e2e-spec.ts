import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Prisma } from '@prisma/client';
import { createTestApp } from './helpers/create-test-app';
import { buildAdminToken } from './helpers/jwt.helper';
import { PrismaMock } from './helpers/prisma.mock';

function gql(app: INestApplication, query: string, token?: string) {
  const req = request(app.getHttpServer())
    .post('/graphql')
    .send({ query });

  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }

  return req;
}

describe('Expenses (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaMock;
  let token: string;

  const mockExpense = {
    id: 'exp-1',
    description: 'Papelería',
    amount: new Prisma.Decimal('50.00'),
    date: new Date('2026-01-15'),
    category: 'Oficina',
    fundSource: 'NON_TITHE',
    createdBy: 'admin@ipul.local',
    createdAt: new Date(),
  };

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    token = buildAdminToken();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    prisma.expense.create.mockResolvedValue(mockExpense);
    prisma.expense.findMany.mockResolvedValue([mockExpense]);
  });

  it('createExpense creates and returns an expense', async () => {
    const mutation = `
      mutation {
        createExpense(
          input: {
            description: "Papelería"
            amount: "50.00"
            date: "2026-01-15"
            category: "Oficina"
            fundSource: NON_TITHE
          }
          createdBy: "admin@ipul.local"
        ) {
          id
          description
          amount
          fundSource
        }
      }
    `;

    const res = await gql(app, mutation, token);

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.createExpense).toMatchObject({
      id: 'exp-1',
      description: 'Papelería',
      amount: '50',
      fundSource: 'NON_TITHE',
    });
  });

  it('expenses query returns list', async () => {
    const query = `
      query {
        expenses {
          id
          description
          amount
          fundSource
        }
      }
    `;

    const res = await gql(app, query, token);

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.expenses).toHaveLength(1);
    expect(res.body.data.expenses[0]).toMatchObject({
      id: 'exp-1',
      description: 'Papelería',
    });
  });

  it('returns 401 when no token is provided', async () => {
    const query = `
      query {
        expenses {
          id
        }
      }
    `;

    const res = await gql(app, query);

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toContain('Unauthorized');
  });
});
