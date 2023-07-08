import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async getNumber(val: any): Promise<any> {
    return await this.cacheManager.get(val);
  }

  async setNumber(val: any): Promise<any> {
    return await this.cacheManager.set(val, Math.floor(Math.random() * 10), { ttl: 5 })
  }

  getAutoCaching() {
    return {
      id: 1,
      name: 'John Doeeee',
      email: 'okee@gmail.com',
      phone: '123456789',
      address: '123 Main St',
      createdAt: new Date(),
    };
  }
}
