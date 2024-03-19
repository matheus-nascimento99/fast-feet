import { Order } from '@/domain/orders-control/enterprise/entities/order'
import { OrderWithDetails } from '@/domain/orders-control/enterprise/entities/value-objects/order-with-details'

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

  static toHTTPWithDetails(orderWithDetails: OrderWithDetails) {
    return {
      orderId: orderWithDetails.orderId.toString(),
      recipient: {
        id: orderWithDetails.recipient.id.toString(),
        name: orderWithDetails.recipient.name,
      },
      deliveryMan: {
        id: orderWithDetails.deliveryMan.id.toString(),
        name: orderWithDetails.deliveryMan.name,
      },
      coordinates: orderWithDetails.coordinates,
      status: orderWithDetails.status,
      attachment: orderWithDetails.attachment,
      postedAt: orderWithDetails.postedAt,
      retiredAt: orderWithDetails.retiredAt,
      deliveredAt: orderWithDetails.deliveredAt,
      returnedAt: orderWithDetails.returnedAt,
      updatedAt: orderWithDetails.updatedAt,
    }
  }
}
