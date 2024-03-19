import { PaginationParams } from '@/core/repositories/pagination-params'
import { LatLng } from '@/core/types/coordinates'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Order } from '../../enterprise/entities/order'
import { OrderWithDetails } from '../../enterprise/entities/value-objects/order-with-details'

export abstract class OrdersRepository {
  abstract create(data: Order): Promise<void>
  abstract findMany(paginationParams: PaginationParams): Promise<Order[]>
  abstract findManyNearByDeliveryMan(
    paginationParams: PaginationParams,
    deliveryManCoordinates: LatLng,
    deliveryManId: UniqueEntityId,
  ): Promise<Order[]>

  abstract findManyByDeliveryMan(
    paginationParams: PaginationParams,
    deliveryManId: UniqueEntityId,
  ): Promise<Order[]>

  abstract findManyWithDetails(
    paginationParams: PaginationParams,
  ): Promise<OrderWithDetails[]>

  abstract findById(orderId: string): Promise<Order | null>
  abstract save(orderId: UniqueEntityId, data: Order): Promise<void>
  abstract delete(orderId: UniqueEntityId): Promise<void>
}
