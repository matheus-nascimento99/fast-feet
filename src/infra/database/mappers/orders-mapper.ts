import { Order as PrismaOrder, Prisma } from '@prisma/client'

import { LatLng } from '@/core/types/coordinates'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { Attachment } from '@/domain/orders-control/enterprise/entities/attachment'
import { Order } from '@/domain/orders-control/enterprise/entities/order'

export class PrismaOrdersMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        recipientId: new UniqueEntityId(raw.recipientId),
        deliveryManId: new UniqueEntityId(raw.deliveryManId),
        coordinates: raw.coordinates as unknown as LatLng,
        status: raw.status,
        attachment: raw.attachment
          ? Attachment.create({ link: raw.attachment })
          : null,
        createdAt: raw.createdAt,
        postedAt: raw.postedAt,
        retiredAt: raw.retiredAt,
        deliveredAt: raw.deliveredAt,
        returnedAt: raw.returnedAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliveryManId: order.deliveryManId.toString(),
      coordinates: order.coordinates as unknown as Prisma.InputJsonValue,
      status: order.status,
      attachment: order.attachment ? order.attachment.link : null,
      createdAt: order.createdAt,
      postedAt: order.postedAt ? order.postedAt : null,
      retiredAt: order.retiredAt ? order.retiredAt : null,
      deliveredAt: order.deliveredAt ? order.deliveredAt : null,
      returnedAt: order.returnedAt ? order.returnedAt : null,
      updatedAt: order.updatedAt ? order.updatedAt : null,
    }
  }
}
