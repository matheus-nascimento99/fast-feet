import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { Recipient } from '@/domain/orders-control/enterprise/entities/recipient'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'

export class PrismaRecipientsMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        email: raw.email,
        individualRegistration: Mask.create(raw.individualRegistration),
        cellphone: Mask.create(raw.cellphone),
        postalCode: Mask.create(raw.postalCode),
        street: raw.street,
        streetNumber: raw.streetNumber,
        complement: raw.complement,
        neighborhood: raw.neighborhood,
        city: raw.city,
        state: raw.state,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      individualRegistration: recipient.individualRegistration.value,
      cellphone: recipient.cellphone.value,
      postalCode: recipient.postalCode.value,
      street: recipient.street,
      streetNumber: recipient.streetNumber,
      complement: recipient.complement ? recipient.complement : null,
      neighborhood: recipient.neighborhood,
      city: recipient.city,
      state: recipient.state,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt ? recipient.updatedAt : null,
    }
  }
}
