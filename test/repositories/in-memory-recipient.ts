import { PaginationParams } from '@/core/repositories/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { RecipientsRepository } from '@/domain/orders-control/application/repositories/recipient'
import { Recipient } from '@/domain/orders-control/enterprise/entities/recipient'

import { InMemoryAdressesRepository } from './in-memory-address'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  constructor(private inMemoryAdressesRepository: InMemoryAdressesRepository) {}

  async create(data: Recipient) {
    this.items.push(data)

    this.inMemoryAdressesRepository.createMany(data.adresses.getItems())
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

  async findByIndividualRegistration(individualRegistration: string) {
    const recipient = this.items.find(
      (item) => item.individualRegistration.value === individualRegistration,
    )

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByEmail(email: string) {
    const recipient = this.items.find((item) => item.email === email)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByCellphone(cellphone: string) {
    const recipient = this.items.find(
      (item) => item.cellphone.value === cellphone,
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

    this.inMemoryAdressesRepository.createMany(data.adresses.getNewItems())
    this.inMemoryAdressesRepository.deleteMany(data.adresses.getRemovedItems())
  }

  async delete(recipientId: UniqueEntityId) {
    const recipientIndex = this.items.findIndex(
      (item) => item.id === recipientId,
    )
    this.items.splice(recipientIndex, 1)

    this.inMemoryAdressesRepository.deleteManyByRecipientId(recipientId)
  }
}
