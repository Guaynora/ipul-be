import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ParishionerRepositoryPort } from '../application/ports/parishioner.repository.port';

@Injectable()
export class PrismaParishionerRepository implements ParishionerRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: {
    name: string;
    baptized: boolean;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  }) {
    return this.prisma.parishioner.create({
      data: {
        ...payload,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        address: payload.address ?? null,
      },
    });
  }

  update(id: string, payload: Record<string, unknown>) {
    return this.prisma.parishioner.update({ where: { id }, data: payload });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.parishioner.delete({ where: { id } });
  }

  findById(id: string) {
    return this.prisma.parishioner.findUnique({ where: { id } });
  }

  findAll() {
    return this.prisma.parishioner.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
