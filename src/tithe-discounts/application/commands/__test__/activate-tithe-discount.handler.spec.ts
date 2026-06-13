import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ActivateTitheDiscountCommand } from '../activate-tithe-discount.command';
import { ActivateTitheDiscountHandler } from '../activate-tithe-discount.handler';
import { TitheDiscountEntity } from '../../../domain/tithe-discount.entity';

describe('ActivateTitheDiscountHandler', () => {
  const makeRepo = () => ({
    create: jest.fn(),
    activate: jest.fn(),
    findById: jest.fn(),
    findActive: jest.fn(),
    findMany: jest.fn(),
  });

  const makeDraftDiscount = (overrides: Partial<TitheDiscountEntity> = {}): TitheDiscountEntity => ({
    id: 'td-1',
    version: 1,
    status: 'DRAFT',
    effectiveFrom: new Date('2026-01-01'),
    rules: { percentage: 10 },
    createdBy: 'admin@ipul.local',
    createdAt: new Date('2026-01-01'),
    activatedAt: null,
    ...overrides,
  });

  it('activates a DRAFT tithe discount successfully', async () => {
    const draft = makeDraftDiscount();
    const activated = { ...draft, status: 'ACTIVE' as const, activatedAt: new Date() };
    const repo = makeRepo();
    repo.findById.mockResolvedValue(draft);
    repo.activate.mockResolvedValue(activated);
    const handler = new ActivateTitheDiscountHandler(repo);

    const result = await handler.execute(new ActivateTitheDiscountCommand('td-1'));

    expect(result).toEqual(activated);
    expect(repo.findById).toHaveBeenCalledWith('td-1');
    expect(repo.activate).toHaveBeenCalledWith('td-1');
  });

  it('throws NotFoundException when discount does not exist', async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(null);
    const handler = new ActivateTitheDiscountHandler(repo);

    await expect(
      handler.execute(new ActivateTitheDiscountCommand('non-existent-id')),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(repo.activate).not.toHaveBeenCalled();
  });

  it('throws UnprocessableEntityException when discount is already ACTIVE', async () => {
    const active = makeDraftDiscount({ status: 'ACTIVE', activatedAt: new Date() });
    const repo = makeRepo();
    repo.findById.mockResolvedValue(active);
    const handler = new ActivateTitheDiscountHandler(repo);

    await expect(
      handler.execute(new ActivateTitheDiscountCommand('td-1')),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);

    expect(repo.activate).not.toHaveBeenCalled();
  });

  it('throws UnprocessableEntityException when discount is RETIRED', async () => {
    const retired = makeDraftDiscount({ status: 'RETIRED' });
    const repo = makeRepo();
    repo.findById.mockResolvedValue(retired);
    const handler = new ActivateTitheDiscountHandler(repo);

    await expect(
      handler.execute(new ActivateTitheDiscountCommand('td-1')),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);

    expect(repo.activate).not.toHaveBeenCalled();
  });
});
