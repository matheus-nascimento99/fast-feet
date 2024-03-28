import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { AdressesRepository } from '@/domain/orders-control/application/repositories/address'
import { Address } from '@/domain/orders-control/enterprise/entities/address'

export class InMemoryAdressesRepository implements AdressesRepository {
  public items: Address[] = []

  async create(data: Address): Promise<void> {
    this.items.push(data)
  }

  async createMany(data: Address[]): Promise<void> {
    this.items.push(...data)
  }

  async findMany(): Promise<Address[]> {
    return this.items
  }

  async findManyByRecipientId(recipientId: UniqueEntityId): Promise<Address[]> {
    const adresses = this.items.filter(
      (item) => item.recipientId && item.recipientId.equals(recipientId),
    )

    return adresses
  }

  async findById(addressId: UniqueEntityId): Promise<Address | null> {
    const address = this.items.find((item) => item.id.equals(addressId))

    if (!address) {
      return null
    }

    return address
  }

  async save(addressId: UniqueEntityId, data: Address): Promise<void> {
    const addressIndex = this.items.findIndex((item) =>
      item.id.equals(addressId),
    )

    this.items[addressIndex] = data
  }

  async delete(addressId: UniqueEntityId): Promise<void> {
    const addressIndex = this.items.findIndex((item) =>
      item.id.equals(addressId),
    )

    this.items.splice(addressIndex, 1)
  }

  async deleteMany(data: Address[]): Promise<void> {
    this.items = this.items.filter((item) => {
      return !data.some((address) => address.equals(item))
    })
  }

  async deleteManyByRecipientId(recipientId: UniqueEntityId): Promise<void> {
    this.items = this.items.filter(
      (item) => item.recipientId && !item.recipientId.equals(recipientId),
    )
  }
}
