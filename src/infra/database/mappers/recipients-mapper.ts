import { Prisma, User as PrismaRecipient } from '@prisma/client'

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
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.UserUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      individualRegistration: recipient.individualRegistration.value,
      cellphone: recipient.cellphone.value,
      password: recipient.password,
      role: 'RECIPIENT',
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt ? recipient.updatedAt : null,
    }
  }
}
