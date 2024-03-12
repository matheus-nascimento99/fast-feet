import { PaginationParams } from '@/core/repositories/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { DeliveryMan } from '../../enterprise/entities/delivery-man'

export abstract class DeliveryMenRepository {
  abstract create(data: DeliveryMan): Promise<void>
  abstract findMany(paginationParams: PaginationParams): Promise<DeliveryMan[]>
  abstract findById(deliveryManId: string): Promise<DeliveryMan | null>
  abstract findByEmail(email: string): Promise<DeliveryMan | null>
  abstract findByIndividualRegistration(
    individualRegistration: string,
  ): Promise<DeliveryMan | null>

  abstract findByCellphone(cellphone: string): Promise<DeliveryMan | null>

  abstract save(deliveryManId: UniqueEntityId, data: DeliveryMan): Promise<void>
  abstract delete(deliveryManId: UniqueEntityId): Promise<void>
}
