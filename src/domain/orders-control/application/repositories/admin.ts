import { PaginationParams } from '@/core/repositories/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Admin } from '../../enterprise/entities/admin'

export abstract class AdminsRepository {
  abstract create(data: Admin): Promise<void>
  abstract findMany(paginationParams: PaginationParams): Promise<Admin[]>
  abstract findById(adminId: string): Promise<Admin | null>
  abstract findByEmail(email: string): Promise<Admin | null>
  abstract findByIndividualRegistration(
    individualRegistration: string,
  ): Promise<Admin | null>

  abstract findByCellphone(cellphone: string): Promise<Admin | null>

  abstract save(adminId: UniqueEntityId, data: Admin): Promise<void>
  abstract delete(adminId: UniqueEntityId): Promise<void>
}
