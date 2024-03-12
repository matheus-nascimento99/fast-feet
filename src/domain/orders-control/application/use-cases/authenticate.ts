import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'

import { Admin } from '../../enterprise/entities/admin'
import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { Mask } from '../../enterprise/entities/value-objects/mask'
import { Cryptographer } from '../cryptography/cryptographer'
import { HashComparer } from '../hash/hash-comparer'
import { AdminsRepository } from '../repositories/admin'
import { DeliveryMenRepository } from '../repositories/delivery-man'

type AuthenticateRepositories = 'adminsRepository' | 'deliveryMenRepository'
type UserResponse = Admin | DeliveryMan

interface AuthenticateUseCaseRequest {
  individualRegistration: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  {
    accessToken: string
  },
  NotAuthorizedError
>
@Injectable()
export class AuthenticateUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private deliveryMenRepository: DeliveryMenRepository,
    private hashComparer: HashComparer,
    private cryptographer: Cryptographer,
  ) {}

  async execute({
    individualRegistration,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    let user: UserResponse | null = null

    const { hashComparer, cryptographer, ...rest } = this //eslint-disable-line

    const repositories = Object.keys({
      ...rest,
    })

    for (const repository of repositories) {
      user = await this[
        repository as AuthenticateRepositories
      ].findByIndividualRegistration(
        Mask.takeOffFromText(individualRegistration).value,
      )

      if (user) {
        break
      }
    }

    if (!user) {
      return left(new NotAuthorizedError('Invalid credentials.'))
    }

    const isPasswordsEquals = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordsEquals) {
      return left(new NotAuthorizedError('Invalid credentials.'))
    }

    const accessToken = await this.cryptographer.encrypt({
      sub: user.id.toString(),
      role: user.constructor.name.toUpperCase(),
    })

    return right({
      accessToken,
    })
  }
}
