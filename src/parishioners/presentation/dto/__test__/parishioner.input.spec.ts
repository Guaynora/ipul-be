import { validate } from 'class-validator';
import { CreateParishionerInput } from '../parishioner.input';

describe('CreateParishionerInput', () => {
  it('accepts valid optional email and phone', async () => {
    const input = Object.assign(new CreateParishionerInput(), {
      name: 'Luis',
      baptized: true,
      email: 'luis@example.com',
      phone: '+573001112233',
    });

    const errors = await validate(input);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid email and phone format', async () => {
    const input = Object.assign(new CreateParishionerInput(), {
      name: 'Maria',
      baptized: true,
      email: 'bad-email',
      phone: 'abc',
    });

    const errors = await validate(input);
    expect(errors.map((err) => err.property).sort()).toEqual([
      'email',
      'phone',
    ]);
  });
});
