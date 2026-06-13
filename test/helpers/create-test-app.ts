import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { HttpExceptionFilter } from '../../src/shared/presentation/filters/http-exception.filter';
import { buildPrismaMock, PrismaMock } from './prisma.mock';

export async function createTestApp(): Promise<{
  app: INestApplication;
  prisma: PrismaMock;
}> {
  const prisma = buildPrismaMock();

  const module = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue(prisma)
    .compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.init();

  return { app, prisma };
}
