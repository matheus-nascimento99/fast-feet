import { Injectable } from '@nestjs/common'

import { Cacher } from '../cacher'
import { RedisService } from './redis.service'

@Injectable()
export class RedisCacher implements Cacher {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 60 * 10) // 10 minutes
  }

  async get(key: string): Promise<string | null> {
    const value = await this.redis.get(key)

    if (!value) {
      return null
    }

    return value
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key)
  }
}
