import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import {
  Order,
  OrderProps,
} from '@/domain/orders-control/enterprise/entities/order'
import { PrismaOrdersMapper } from '@/infra/database/mappers/orders-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export const makeOrder = (
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) => {
  const order = Order.create(
    {
      deliveryManId: new UniqueEntityId(faker.string.uuid()),
      recipientId: new UniqueEntityId(faker.string.uuid()),
      coordinates: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      },
      ...override,
    },
    id,
  )

  return order
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(override: Partial<OrderProps> = {}) {
    const order = makeOrder(override)
    const data = PrismaOrdersMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })

    return order
  }
}
