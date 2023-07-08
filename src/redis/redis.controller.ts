import { Controller, Get, UseInterceptors  } from '@nestjs/common';
import { CacheInterceptor, CacheKey,CacheTTL } from '@nestjs/cache-manager';

import { RedisService } from './redis.service';

@UseInterceptors(CacheInterceptor)
@Controller('redis')
export class RedisController {

    constructor(private readonly redisService: RedisService) { }

    @Get()
    async getNumber(): Promise<any> {
        
        const val = await this.redisService.getNumber('number')
        if (val) {
            return {
                data: val,
                FromRedis: 'this is loaded from redis cache'
            }
        }

        if (!val) {
            const random = await this.redisService.setNumber('number')
            return {
                data: random,
                FromRandomNumDbs: 'this is loaded from randomNumDbs'
            }
        }
    }

    @Get('auto-caching')
    @CacheKey('auto-caching-fake-model')
    @CacheTTL(10)
    getAutoCaching() {
        return this.redisService.getAutoCaching;
      }
}
