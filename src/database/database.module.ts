import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('TYPEORM_HOST'),
        port: configService.get('TYPEORM_PORT'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        // schema: configService.get('TYPEORM_SCHEMA'), 
        database: configService.get('TYPEORM_DATABASE'),
        entities: [
          join(
            __dirname,
            '..',
            'modules',
            '**',
            'entities',
            '*.entity{.js,.ts}',
          ),
        ],
        synchronize: configService.get('TYPEORM_SYNCHRONIZE'),
        logging: configService.get('TYPEORM_LOGGING'),
        ssl:
          configService.get<boolean>('TYPEORM_SSL') === true
            ? {
                ca: readFileSync(join(process.cwd(), 'rds-ca.pem')).toString(),
              }
            : false,
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
