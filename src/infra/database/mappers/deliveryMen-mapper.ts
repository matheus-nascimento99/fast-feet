import { Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { DeliveryMan } from '@/domain/orders-control/enterprise/entities/delivery-man'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'

export class PrismaDeliveryMenMapper {
  static toDomain(raw: PrismaUser): DeliveryMan {
    return DeliveryMan.create(
      {
        name: raw.name,
        email: raw.email,
        cellphone: Mask.create(raw.cellphone),
        individualRegistration: Mask.create(raw.individualRegistration),
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(deliveryMan: DeliveryMan): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryMan.id.toString(),
      name: deliveryMan.name,
      email: deliveryMan.email,
      individualRegistration: deliveryMan.individualRegistration.value,
      cellphone: deliveryMan.cellphone.value,
      password: deliveryMan.password,
      role: 'DELIVERYMAN',
      createdAt: deliveryMan.createdAt,
      updatedAt: deliveryMan.updatedAt ?? null,
    }
  }
}
