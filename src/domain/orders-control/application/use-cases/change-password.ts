import { hash } from 'bcryptjs'

import { Either, left, right } from '@/core/either'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AuthRepositories, AuthResponse } from '@/core/types/auth'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Admin } from '../../enterprise/entities/admin'
import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { AdminsRepository } from '../repositories/admin'
import { DeliveryMenRepository } from '../repositories/delivery-man'

interface ChangePasswordUseCaseRequest {
  userId: string
  newPassword: string
}

type ChangePasswordUseCaseResponse = Either<unknown, NotAuthorizedError>

export class ChangePasswordUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private deliveryMenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    userId,
    newPassword,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    let user: AuthResponse | null = null

    const repositories = Object.keys(this)

    for (const repository of repositories) {
      user = await this[repository as AuthRepositories].findById(userId)

      if (user) {
        break
      }
    }

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const passwordHashed = await hash(newPassword, 8)

    user.password = passwordHashed

    if (user instanceof Admin) {
      await this.adminsRepository.save(new UniqueEntityId(userId), user)
    } else if (user instanceof DeliveryMan) {
      await this.deliveryMenRepository.save(new UniqueEntityId(userId), user)
    }

    return right({})
  }
}
