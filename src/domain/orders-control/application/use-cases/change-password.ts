import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AuthRepositories, AuthResponse } from '@/core/types/auth'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Admin } from '../../enterprise/entities/admin'
import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { HashCreator } from '../hash/hash-creator'
import { AdminsRepository } from '../repositories/admin'
import { DeliveryMenRepository } from '../repositories/delivery-man'

interface ChangePasswordUseCaseRequest {
  userId: string
  newPassword: string
}

type ChangePasswordUseCaseResponse = Either<unknown, ResourceNotFoundError>
@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private deliveryMenRepository: DeliveryMenRepository,
    private hashCreator: HashCreator,
  ) {}

  async execute({
    userId,
    newPassword,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    let user: AuthResponse | null = null

    const { hashCreator, ...rest } = this //eslint-disable-line

    const repositories = Object.keys({
      ...rest,
    })

    for (const repository of repositories) {
      user = await this[repository as AuthRepositories].findById(userId)

      if (user) {
        break
      }
    }

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const passwordHashed = await this.hashCreator.create(newPassword)

    user.password = passwordHashed

    if (user instanceof Admin) {
      await this.adminsRepository.save(new UniqueEntityId(userId), user)
    } else if (user instanceof DeliveryMan) {
      await this.deliveryMenRepository.save(new UniqueEntityId(userId), user)
    }

    return right({})
  }
}
