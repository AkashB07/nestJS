import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Cat } from 'src/cats/cat.entity';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: process.env.DB_TYPE as any,
          host: process.env.PG_HOST,
          port: parseInt(process.env.PG_PORT),
          username: process.env.PG_USER,
          password: process.env.PG_PASSWORD,
          database: process.env.PG_DB,
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],
          entities: [Cat],
          synchronize: true,
        }),
      ]
})
export class DatabaseModule {}
