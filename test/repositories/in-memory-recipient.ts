import { PaginationParams } from '@/core/repositories/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { RecipientsRepository } from '@/domain/orders-control/application/repositories/recipient'
import { Recipient } from '@/domain/orders-control/enterprise/entities/recipient'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async create(data: Recipient) {
    this.items.push(data)
  }

  async findMany({ page, limit }: PaginationParams) {
    const recipients = this.items.splice((page - 1) * limit, page * limit)

    return recipients
  }

  async findById(recipientId: string) {
    const recipient = this.items.find(
      (item) => item.id.toString() === recipientId,
    )

    if (!recipient) {
      return null
    }

    return recipient
  }

  async save(recipientId: UniqueEntityId, data: Recipient) {
    const recipientIndex = this.items.findIndex(
      (item) => item.id === recipientId,
    )
    this.items[recipientIndex] = data
  }

  async delete(recipientId: UniqueEntityId) {
    const recipientIndex = this.items.findIndex(
      (item) => item.id === recipientId,
    )
    this.items.splice(recipientIndex, 1)
  }
}
