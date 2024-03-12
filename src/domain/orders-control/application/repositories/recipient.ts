import { PaginationParams } from '@/core/repositories/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Recipient } from '../../enterprise/entities/recipient'

export abstract class RecipientsRepository {
  abstract create(data: Recipient): Promise<void>
  abstract findMany(paginationParams: PaginationParams): Promise<Recipient[]>
  abstract findById(recipientId: string): Promise<Recipient | null>
  abstract save(recipientId: UniqueEntityId, data: Recipient): Promise<void>
  abstract delete(recipientId: UniqueEntityId): Promise<void>
}
