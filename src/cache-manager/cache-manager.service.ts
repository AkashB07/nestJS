import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

export class CacheManagerService {
  private readonly logger = new Logger(CacheManagerService.name);
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setVal(prefix: string, key: any, value: any, ttl: number = 5000) {
    if (typeof key !== 'string') {
      key = JSON.stringify(key);
    }
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    return this.cacheManager.set(`${prefix}:${key}`, value, ttl);
  }

  async getVal(prefix: string, key: any) {
    if (typeof key !== 'string') {
      key = JSON.stringify(key);
    }
    const result = await this.cacheManager.get(`${prefix}:${key}`);
    if (result) {
      try {
        return JSON.parse(`${result}`);
      } catch {
        return result;
      }
    }
  }

  async deleteVal(prefix: string, key: any) {
    if (typeof key !== 'string') {
      key = JSON.stringify(key);
    }
    return this.cacheManager.del(`${prefix}:${key}`);
  }

  async clearAllPrefix(prefix: string) {
    return this.cacheManager.del(`${prefix}:*`);
  }

  async deleteKeysByPrefix(prefix: string): Promise<void> {
    const keys = await this.cacheManager.store.keys();
    const filteredKeys = keys.filter((key) => key.startsWith(`${prefix}:`));
    if (filteredKeys.length) {
      for (let item of filteredKeys) {
        await this.cacheManager.del(item);
      }
    }
  }

  async cachedResults(prefix: string, func, args) {
    const cacheData = await this.getVal(prefix, args);
    if (cacheData) {
      this.logger.debug({ 'Cache HIT': cacheData });
      return cacheData;
    } else {
      this.logger.debug({ 'Cache MISS': { prefix, args } });
      const data = await func(...args);
      await this.setVal(prefix, args, data);
      return data;
    }
  }
}
