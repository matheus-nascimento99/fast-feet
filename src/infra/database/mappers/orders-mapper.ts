import {
  Order as PrismaOrder,
  Prisma,
  User as PrismaDeliveryMan,
  User as PrismaRecipient,
} from '@prisma/client'

import { LatLng } from '@/core/types/coordinates'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { Attachment } from '@/domain/orders-control/enterprise/entities/attachment'
import { Order } from '@/domain/orders-control/enterprise/entities/order'
import { OrderWithDetails } from '@/domain/orders-control/enterprise/entities/value-objects/order-with-details'

export type PrismaOrdersWithDetailsMapperParams = PrismaOrder & {
  deliveryMen: PrismaDeliveryMan
  recipients: PrismaRecipient
}

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

  static toDomainWithDetails(
    raw: PrismaOrdersWithDetailsMapperParams,
  ): OrderWithDetails {
    return OrderWithDetails.create({
      orderId: new UniqueEntityId(raw.id),
      recipient: {
        id: new UniqueEntityId(raw.recipients.id),
        name: raw.recipients.name,
      },
      deliveryMan: {
        id: new UniqueEntityId(raw.deliveryMen.id),
        name: raw.deliveryMen.name,
      },
      coordinates: raw.coordinates as unknown as LatLng,
      status: raw.status,
      createdAt: raw.createdAt,
      attachment: raw.attachment
        ? Attachment.create({ link: raw.attachment })
        : null,
      postedAt: raw.postedAt,
      retiredAt: raw.retiredAt,
      deliveredAt: raw.deliveredAt,
      returnedAt: raw.returnedAt,
      updatedAt: raw.updatedAt,
    })
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
