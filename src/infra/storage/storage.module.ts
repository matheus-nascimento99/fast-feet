import { Module } from '@nestjs/common'

import { Storage } from '@/domain/orders-control/application/storage/storage'

import { EnvService } from '../env/env.service'
import { R2Storage } from './r2-storage'

@Module({
  providers: [{ provide: Storage, useClass: R2Storage }, EnvService],
  exports: [Storage],
})
export class StorageModule {}
