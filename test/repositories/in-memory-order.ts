import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { LatLng } from '@/core/types/coordinates'
import { getDistanceBetweenCoordinates } from '@/core/utils/get-distance-between-coordinates'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { OrdersRepository } from '@/domain/orders-control/application/repositories/order'
import { Order } from '@/domain/orders-control/enterprise/entities/order'
import { OrderWithDetails } from '@/domain/orders-control/enterprise/entities/value-objects/order-with-details'

import { InMemoryDeliveryMenRepository } from './in-memory-delivery-man'
import { InMemoryRecipientsRepository } from './in-memory-recipient'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(
    private inMemoryRecipientsRepository: InMemoryRecipientsRepository,
    private inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository,
  ) {}

  async create(data: Order) {
    this.items.push(data)
  }

  async findMany({ page, limit }: PaginationParams) {
    const orders = this.items.splice((page - 1) * limit, page * limit)

    return orders
  }

  async findManyNearByDeliveryMan(
    { page, limit }: PaginationParams,
    deliveryManLatLng: LatLng,
    deliveryManId: UniqueEntityId,
  ) {
    const orders = this.items
      .filter((item) => {
        const distanceBetweenRecipientAndDeliveryMan =
          getDistanceBetweenCoordinates(
            { lat: deliveryManLatLng.lat, lng: deliveryManLatLng.lng },
            { lat: item.coordinates.lat, lng: item.coordinates.lng },
          )

        if (
          item.deliveryManId === deliveryManId &&
          distanceBetweenRecipientAndDeliveryMan <= 3
        ) {
          return true
        }

        return false
      })
      .splice((page - 1) * limit, page * limit)

    return orders
  }

  async findManyByDeliveryMan(
    { page, limit }: PaginationParams,
    deliveryManId: UniqueEntityId,
  ) {
    const orders = this.items
      .filter((item) => item.deliveryManId === deliveryManId)
      .splice((page - 1) * limit, page * limit)

    return orders
  }

  async findManyWithDetails({ page, limit }: PaginationParams) {
    const orders = this.items
      .map((order) => {
        const recipient = this.inMemoryRecipientsRepository.items.find((item) =>
          item.id.equals(order.recipientId),
        )

        if (!recipient) {
          throw new Error('Recipient not found.')
        }

        const deliveryMan = this.inMemoryDeliveryMenRepository.items.find(
          (item) => item.id.equals(order.deliveryManId),
        )

        if (!deliveryMan) {
          throw new Error('Delivery man not found.')
        }

        return OrderWithDetails.create({
          orderId: order.id,
          recipient: {
            id: recipient.id,
            name: recipient.name,
          },
          deliveryMan: {
            id: deliveryMan.id,
            name: deliveryMan.name,
          },
          coordinates: order.coordinates,
          status: order.status,
          createdAt: order.createdAt,
          attachment: order.attachment,
          postedAt: order.postedAt,
          retiredAt: order.retiredAt,
          deliveredAt: order.deliveredAt,
          returnedAt: order.returnedAt,
          updatedAt: order.updatedAt,
        })
      })
      .slice((page - 1) * limit, page * limit)

    return orders
  }

  async findById(orderId: string) {
    const order = this.items.find((item) => item.id.toString() === orderId)

    if (!order) {
      return null
    }

    return order
  }

  async save(orderId: UniqueEntityId, data: Order) {
    const orderIndex = this.items.findIndex((item) => item.id === orderId)
    this.items[orderIndex] = data

    DomainEvents.dispatchEventsForAggregate(orderId)
  }

  async delete(orderId: UniqueEntityId) {
    const orderIndex = this.items.findIndex((item) => item.id === orderId)
    this.items.splice(orderIndex, 1)
  }
}
