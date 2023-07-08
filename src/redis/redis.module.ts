import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import redisStore from "cache-manager-redis-store";

import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';

@Module({
  providers: [RedisService],
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost', //default host
      port: 6379 //default port
    })
  ],
  controllers: [RedisController]
})
export class RedisModule {}
