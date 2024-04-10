import { Module } from '@nestjs/common'

import { EnvModule } from '../env/env.module'
import { Cacher } from './cacher'
import { RedisService } from './redis/redis.service'
import { RedisCacher } from './redis/redis-cacher'

@Module({
  imports: [EnvModule],
  providers: [RedisService, { provide: Cacher, useClass: RedisCacher }],
  exports: [RedisService, Cacher],
})
export class CacheModule {}
