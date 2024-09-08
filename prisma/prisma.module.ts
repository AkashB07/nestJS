import { Module, Global } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Global() // Make the Prisma module globally available
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PrismaService,
      useFactory: (configService: ConfigService) => {
        return new PrismaService({
          datasources: {
            db: {
              url: configService.get<string>('DATABASE_URL'),
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule { }
