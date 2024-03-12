import { PaginationParams } from '@/core/repositories/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { AdminsRepository } from '@/domain/orders-control/application/repositories/admin'
import { Admin } from '@/domain/orders-control/enterprise/entities/admin'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async create(data: Admin) {
    this.items.push(data)
  }

  async findMany({ page, limit }: PaginationParams) {
    const admins = this.items.splice((page - 1) * limit, page * limit)

    return admins
  }

  async findById(adminId: string) {
    const admin = this.items.find((item) => item.id.toString() === adminId)

    if (!admin) {
      return null
    }

    return admin
  }

  async findByEmail(email: string) {
    const admin = this.items.find((item) => item.email === email)

    if (!admin) {
      return null
    }

    return admin
  }

  async findByIndividualRegistration(individualRegistration: string) {
    const admin = this.items.find(
      (item) => item.individualRegistration.value === individualRegistration,
    )

    if (!admin) {
      return null
    }

    return admin
  }

  async findByCellphone(cellphone: string) {
    const admin = this.items.find((item) => item.cellphone.value === cellphone)

    if (!admin) {
      return null
    }

    return admin
  }

  async findUnique(
    unique: string,
    field: keyof Omit<
      Admin,
      'id' | 'createdAt' | 'updatedAt' | 'name' | 'password'
    >,
  ) {
    const admin = this.items.find((item) => {
      return item[field] instanceof Mask
        ? (item[field] as Mask).value === unique
        : item[field] === unique
    })

    if (!admin) {
      return null
    }

    return admin
  }

  async save(adminId: UniqueEntityId, data: Admin) {
    const adminIndex = this.items.findIndex((item) => item.id === adminId)
    this.items[adminIndex] = data
  }

  async delete(adminId: UniqueEntityId) {
    const adminIndex = this.items.findIndex((item) => item.id === adminId)
    this.items.splice(adminIndex, 1)
  }
}
