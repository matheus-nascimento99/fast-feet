import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

import { HashComparer } from '@/domain/orders-control/application/hash/hash-comparer'
import { HashCreator } from '@/domain/orders-control/application/hash/hash-creator'
@Injectable()
export class BcryptHasher implements HashCreator, HashComparer {
  private NUMBER_SALT_ROUNDS = 8

  async create(plain: string): Promise<string> {
    const plainHashed = await hash(plain, this.NUMBER_SALT_ROUNDS)
    return plainHashed
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const isEqual = await compare(plain, hash)
    return isEqual
  }
}
