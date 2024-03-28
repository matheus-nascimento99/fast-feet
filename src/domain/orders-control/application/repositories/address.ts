import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Address } from '../../enterprise/entities/address'

export abstract class AdressesRepository {
  abstract create(data: Address): Promise<void>
  abstract createMany(data: Address[]): Promise<void>
  abstract findMany(): Promise<Address[]>
  abstract findManyByRecipientId(
    recipientId: UniqueEntityId,
  ): Promise<Address[]>

  abstract findById(addressId: UniqueEntityId): Promise<Address | null>
  abstract save(addressId: UniqueEntityId, data: Address): Promise<void>
  abstract delete(addressId: UniqueEntityId): Promise<void>
  abstract deleteMany(data: Address[]): Promise<void>
  abstract deleteManyByRecipientId(recipientId: UniqueEntityId): Promise<void>
}
