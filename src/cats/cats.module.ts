import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cat } from './cat.entity';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  imports:[TypeOrmModule.forFeature([Cat])],
  providers: [CatsService],
})
export class CatsModule {}
