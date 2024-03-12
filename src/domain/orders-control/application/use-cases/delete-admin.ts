/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { AdminsRepository } from '../repositories/admin'

interface DeleteAdminUseCaseRequest {
  adminId: string
}

type DeleteAdminUseCaseResponse = Either<unknown, ResourceNotFoundError>
@Injectable()
export class DeleteAdminUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    adminId,
  }: DeleteAdminUseCaseRequest): Promise<DeleteAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError('Admin not found.'))
    }

    await this.adminsRepository.delete(admin.id)

    return right({})
  }
}
