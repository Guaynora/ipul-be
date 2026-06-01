import { BadRequestException } from '@nestjs/common';
import { CreateParishionerCommand } from '../create-parishioner.command';
import { CreateParishionerHandler } from '../create-parishioner.handler';
import { PARISHIONER_REPOSITORY } from '../../ports/parishioner.repository.port';

describe('CreateParishionerHandler', () => {
  it('creates parishioner using repository port', async () => {
    const created = {
      id: 'p-1',
      name: 'Ana Perez',
      email: 'ana@example.com',
      phone: '+573001112233',
      address: 'Calle 1',
      baptized: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const repository = {
      create: jest.fn().mockResolvedValue(created),
    };

    const handler = new CreateParishionerHandler(repository as never);
    const result = await handler.execute(
      new CreateParishionerCommand({
        name: 'Ana Perez',
        baptized: true,
        email: 'ana@example.com',
        phone: '+573001112233',
        address: 'Calle 1',
      }),
    );

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(created);
    expect(PARISHIONER_REPOSITORY).toBe('PARISHIONER_REPOSITORY');
  });

  it('rejects when name is empty after trim', async () => {
    const repository = {
      create: jest.fn(),
    };
    const handler = new CreateParishionerHandler(repository as never);

    await expect(
      handler.execute(
        new CreateParishionerCommand({
          name: '   ',
          baptized: false,
        }),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
