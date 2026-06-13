import { UnprocessableEntityException } from '@nestjs/common';
import { CreateTitheDiscountCommand } from '../create-tithe-discount.command';
import { CreateTitheDiscountHandler } from '../create-tithe-discount.handler';

describe('CreateTitheDiscountHandler', () => {
  const makeRepo = () => ({
    create: jest.fn(),
    activate: jest.fn(),
    findById: jest.fn(),
    findActive: jest.fn(),
    findMany: jest.fn(),
  });

  it('creates a tithe discount successfully', async () => {
    const created = {
      id: 'td-1',
      version: 1,
      status: 'DRAFT' as const,
      effectiveFrom: new Date('2026-01-01'),
      rules: { percentage: 10 },
      createdBy: 'admin@ipul.local',
      createdAt: new Date('2026-01-01'),
      activatedAt: null,
    };
    const repo = makeRepo();
    repo.create.mockResolvedValue(created);
    const handler = new CreateTitheDiscountHandler(repo);

    const result = await handler.execute(
      new CreateTitheDiscountCommand({
        effectiveFrom: new Date('2026-01-01'),
        rules: '{"percentage": 10}',
        createdBy: 'admin@ipul.local',
      }),
    );

    expect(result).toEqual(created);
    expect(repo.create).toHaveBeenCalledWith({
      effectiveFrom: new Date('2026-01-01'),
      rules: { percentage: 10 },
      createdBy: 'admin@ipul.local',
    });
  });

  it('rejects invalid JSON rules', async () => {
    const repo = makeRepo();
    const handler = new CreateTitheDiscountHandler(repo);

    await expect(
      handler.execute(
        new CreateTitheDiscountCommand({
          effectiveFrom: new Date('2026-01-01'),
          rules: 'not-valid-json',
          createdBy: 'admin@ipul.local',
        }),
      ),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it('rejects rules that is not an object', async () => {
    const repo = makeRepo();
    const handler = new CreateTitheDiscountHandler(repo);

    await expect(
      handler.execute(
        new CreateTitheDiscountCommand({
          effectiveFrom: new Date('2026-01-01'),
          rules: '"just a string"',
          createdBy: 'admin@ipul.local',
        }),
      ),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);

    await expect(
      handler.execute(
        new CreateTitheDiscountCommand({
          effectiveFrom: new Date('2026-01-01'),
          rules: '[1, 2, 3]',
          createdBy: 'admin@ipul.local',
        }),
      ),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it('rejects empty rules object', async () => {
    const repo = makeRepo();
    const handler = new CreateTitheDiscountHandler(repo);

    await expect(
      handler.execute(
        new CreateTitheDiscountCommand({
          effectiveFrom: new Date('2026-01-01'),
          rules: '{}',
          createdBy: 'admin@ipul.local',
        }),
      ),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it('rejects invalid effectiveFrom date', async () => {
    const repo = makeRepo();
    const handler = new CreateTitheDiscountHandler(repo);

    await expect(
      handler.execute(
        new CreateTitheDiscountCommand({
          effectiveFrom: new Date('invalid-date'),
          rules: '{"percentage": 10}',
          createdBy: 'admin@ipul.local',
        }),
      ),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });
});
