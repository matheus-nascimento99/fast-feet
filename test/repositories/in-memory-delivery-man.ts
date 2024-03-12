import { PaginationParams } from '@/core/repositories/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { DeliveryMenRepository } from '@/domain/orders-control/application/repositories/delivery-man'
import { DeliveryMan } from '@/domain/orders-control/enterprise/entities/delivery-man'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'

export class InMemoryDeliveryMenRepository implements DeliveryMenRepository {
  public items: DeliveryMan[] = []

  async create(data: DeliveryMan) {
    this.items.push(data)
  }

  async findMany({ page, limit }: PaginationParams) {
    const deliveryMen = this.items.splice((page - 1) * limit, page * limit)

    return deliveryMen
  }

  async findById(deliveryManId: string) {
    const deliveryMan = this.items.find(
      (item) => item.id.toString() === deliveryManId,
    )

    if (!deliveryMan) {
      return null
    }

    return deliveryMan
  }

  async findByEmail(email: string) {
    const deliveryMan = this.items.find((item) => item.email === email)

    if (!deliveryMan) {
      return null
    }

    return deliveryMan
  }

  async findByIndividualRegistration(individualRegistration: string) {
    const deliveryMan = this.items.find(
      (item) => item.individualRegistration.value === individualRegistration,
    )

    if (!deliveryMan) {
      return null
    }

    return deliveryMan
  }

  async findByCellphone(cellphone: string) {
    const deliveryMan = this.items.find(
      (item) => item.cellphone.value === cellphone,
    )

    if (!deliveryMan) {
      return null
    }

    return deliveryMan
  }

  async findUnique(
    unique: string,
    field: keyof Omit<
      DeliveryMan,
      'id' | 'createdAt' | 'updatedAt' | 'name' | 'password'
    >,
  ) {
    const deliveryMan = this.items.find((item) => {
      return item[field] instanceof Mask
        ? (item[field] as Mask).value === unique
        : item[field] === unique
    })

    if (!deliveryMan) {
      return null
    }

    return deliveryMan
  }

  async save(deliveryManId: UniqueEntityId, data: DeliveryMan) {
    const deliveryManIndex = this.items.findIndex(
      (item) => item.id === deliveryManId,
    )

    this.items[deliveryManIndex] = data
  }

  async delete(deliveryManId: UniqueEntityId) {
    const deliveryManIndex = this.items.findIndex(
      (item) => item.id === deliveryManId,
    )

    this.items.splice(deliveryManIndex, 1)
  }
}
