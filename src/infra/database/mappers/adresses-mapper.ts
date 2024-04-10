import { Address as PrismaAddress, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { Address } from '@/domain/orders-control/enterprise/entities/address'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'
export class PrismaAdressesMapper {
  static toDomain(raw: PrismaAddress): Address {
    return Address.create(
      {
        recipientId: raw.recipientId
          ? new UniqueEntityId(raw.recipientId)
          : null,
        postalCode: Mask.create(raw.postalCode),
        street: raw.street,
        streetNumber: raw.streetNumber,
        complement: raw.complement,
        neighborhood: raw.neighborhood,
        city: raw.city,
        state: raw.state,
        principal: raw.principal,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      id: address.id.toString(),
      recipientId: address.recipientId ? address.recipientId.toString() : null,
      postalCode: address.postalCode.value,
      street: address.street,
      streetNumber: address.streetNumber,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      principal: address.principal,
    }
  }
}
