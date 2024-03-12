import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { LatLng } from '@/core/types/coordinates'
import { getDistanceBetweenCoordinates } from '@/core/utils/get-distance-between-coordinates'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { OrdersRepository } from '@/domain/orders-control/application/repositories/order'
import { Order } from '@/domain/orders-control/enterprise/entities/order'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

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
