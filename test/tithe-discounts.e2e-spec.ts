import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './helpers/create-test-app';
import { buildAdminToken } from './helpers/jwt.helper';
import { PrismaMock } from './helpers/prisma.mock';

function gql(app: INestApplication, query: string, token: string) {
  return request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${token}`)
    .send({ query });
}

describe('TitheDiscounts (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaMock;
  let token: string;

  const draftVersion = {
    id: 'td-1',
    version: 1,
    status: 'DRAFT',
    effectiveFrom: new Date('2026-02-01'),
    rules: { minAmount: 100 },
    createdBy: 'admin@ipul.local',
    createdAt: new Date(),
    activatedAt: null,
  };

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    token = buildAdminToken();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mocks (can be overridden per test)
    prisma.discountVersion.aggregate.mockResolvedValue({ _max: { version: null } });
    prisma.discountVersion.create.mockResolvedValue(draftVersion);
    prisma.discountVersion.findUnique.mockResolvedValue(draftVersion);
    prisma.discountVersion.findFirst.mockResolvedValue(null);
    prisma.discountVersion.findMany.mockResolvedValue([draftVersion]);
    prisma.$transaction.mockImplementation(async (cb: (tx: unknown) => Promise<unknown>) => {
      const txMock = {
        discountVersion: {
          updateMany: jest.fn().mockResolvedValue({ count: 0 }),
          update: jest.fn().mockResolvedValue({ ...draftVersion, status: 'ACTIVE', activatedAt: new Date() }),
        },
      };
      return cb(txMock);
    });
  });

  it('createTitheDiscount creates a DRAFT version', async () => {
    const mutation = `
      mutation {
        createTitheDiscount(
          input: {
            effectiveFrom: "2026-02-01"
            rules: "{\\"minAmount\\": 100}"
          }
          createdBy: "admin@ipul.local"
        ) {
          id
          version
          status
          rules
          createdBy
        }
      }
    `;

    const res = await gql(app, mutation, token);

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.createTitheDiscount).toMatchObject({
      id: 'td-1',
      version: 1,
      status: 'DRAFT',
      createdBy: 'admin@ipul.local',
    });
  });

  it('activateTitheDiscount transitions DRAFT to ACTIVE', async () => {
    const mutation = `
      mutation {
        activateTitheDiscount(id: "td-1") {
          id
          status
        }
      }
    `;

    const res = await gql(app, mutation, token);

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.activateTitheDiscount).toMatchObject({
      id: 'td-1',
      status: 'ACTIVE',
    });
  });

  it('titheDiscounts returns all versions', async () => {
    const query = `
      query {
        titheDiscounts {
          id
          version
          status
        }
      }
    `;

    const res = await gql(app, query, token);

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.titheDiscounts).toHaveLength(1);
    expect(res.body.data.titheDiscounts[0]).toMatchObject({
      id: 'td-1',
      version: 1,
    });
  });

  it('activeTitheDiscount returns null when no active version exists', async () => {
    prisma.discountVersion.findFirst.mockResolvedValue(null);

    const query = `
      query {
        activeTitheDiscount {
          id
          status
        }
      }
    `;

    const res = await gql(app, query, token);

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.activeTitheDiscount).toBeNull();
  });
});
