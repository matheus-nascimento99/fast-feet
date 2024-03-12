import { HashComparer } from '@/domain/orders-control/application/hash/hash-comparer'
import { HashCreator } from '@/domain/orders-control/application/hash/hash-creator'

export class FakeHasher implements HashCreator, HashComparer {
  async create(plain: string) {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
