import { Order } from '@/domain/orders-control/enterprise/entities/order'

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      deliveryManId: order.deliveryManId.toString(),
      recipientId: order.recipientId.toString(),
      coordinates: order.coordinates,
      status: order.status,
      createdAt: order.createdAt,
      attachment: order.attachment,
      postedAt: order.postedAt,
      retiredAt: order.retiredAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
      updatedAt: order.updatedAt,
    }
  }
}
