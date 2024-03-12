import { Module } from '@nestjs/common'

import { HashComparer } from '@/domain/orders-control/application/hash/hash-comparer'
import { HashCreator } from '@/domain/orders-control/application/hash/hash-creator'

import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    { provide: HashCreator, useClass: BcryptHasher },
    { provide: HashComparer, useClass: BcryptHasher },
  ],
  exports: [HashCreator, HashComparer],
})
export class HashModule {}
