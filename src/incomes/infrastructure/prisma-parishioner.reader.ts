import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ParishionerReaderPort } from '../application/ports/parishioner-reader.port';

@Injectable()
export class PrismaParishionerReader implements ParishionerReaderPort {
  constructor(private readonly prisma: PrismaService) {}

  async existsById(id: string): Promise<boolean> {
    const found = await this.prisma.parishioner.findUnique({
      where: { id },
      select: { id: true },
    });
    return Boolean(found);
  }
}
