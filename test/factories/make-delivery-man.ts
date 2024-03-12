import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { DEFAULT_PASSWORD } from 'test/utils/default-password'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import {
  DeliveryMan,
  DeliveryManProps,
} from '@/domain/orders-control/enterprise/entities/delivery-man'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'
import { PrismaDeliveryMenMapper } from '@/infra/database/mappers/deliveryMen-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export const makeDeliveryMan = (
  override: Partial<DeliveryManProps> = {},
  id?: UniqueEntityId,
) => {
  const deliveryMan = DeliveryMan.create(
    {
      name: faker.person.fullName(),
      cellphone: Mask.takeOffFromText(faker.phone.number()),
      individualRegistration: Mask.takeOffFromText(
        faker.number.int().toString(),
      ),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliveryMan
}

@Injectable()
export class DeliveryManFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryMan(override: Partial<DeliveryManProps> = {}) {
    const deliveryMan = makeDeliveryMan({
      ...override,
      password: await hash(override.password ?? DEFAULT_PASSWORD, 8),
    })
    const data = PrismaDeliveryMenMapper.toPrisma(deliveryMan)

    await this.prisma.user.create({
      data,
    })

    return deliveryMan
  }
}
