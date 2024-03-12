/* eslint-disable @typescript-eslint/no-empty-interface */
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Mask } from '../../enterprise/entities/value-objects/mask'
import { AdminsRepository } from '../repositories/admin'

interface EditAdminUseCaseRequest {
  adminId: string
  name: string
  individualRegistration: string
  email: string
  cellphone: string
}

type EditAdminUseCaseResponse = Either<unknown, ResourceNotFoundError>

export class EditAdminUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    adminId,
    name,
    individualRegistration,
    email,
    cellphone,
  }: EditAdminUseCaseRequest): Promise<EditAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError('Delivery man not found.'))
    }

    admin.name = name
    admin.individualRegistration = Mask.takeOffFromText(individualRegistration)
    admin.email = email
    admin.cellphone = Mask.takeOffFromText(cellphone)

    await this.adminsRepository.save(admin.id, admin)

    return right({})
  }
}
