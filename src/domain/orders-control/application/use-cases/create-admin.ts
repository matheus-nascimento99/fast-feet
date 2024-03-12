import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'

import { Admin } from '../../enterprise/entities/admin'
import { HashCreator } from '../hash/hash-creator'
import { AdminsRepository } from '../repositories/admin'
import { UserWithSameCellphoneError } from './errors/user-with-same-cellphone'
import { UserWithSameEmailError } from './errors/user-with-same-email'
import { UserWithSameIndividualRegistrationError } from './errors/user-with-same-individual-registration'

interface CreateAdminUseCaseRequest {
  name: string
  individualRegistration: string
  email: string
  password: string
  cellphone: string
}

export type CreateAdminUseCaseResponse = Either<
  {
    item: Admin
  },
  | UserWithSameEmailError
  | UserWithSameIndividualRegistrationError
  | UserWithSameCellphoneError
>
@Injectable()
export class CreateAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashCreator: HashCreator,
  ) {}

  async execute({
    name,
    individualRegistration,
    cellphone,
    email,
    password,
  }: CreateAdminUseCaseRequest): Promise<CreateAdminUseCaseResponse> {
    const deliveryManByEmail = await this.adminsRepository.findByEmail(email)

    if (deliveryManByEmail) {
      return left(
        new UserWithSameEmailError('Already exists an user with same email.'),
      )
    }

    const deliveryManByIndividualRegistration =
      await this.adminsRepository.findByIndividualRegistration(
        individualRegistration,
      )

    if (deliveryManByIndividualRegistration) {
      return left(
        new UserWithSameIndividualRegistrationError(
          'Already exists an user with same individual registration.',
        ),
      )
    }

    const deliveryManByCellphone =
      await this.adminsRepository.findByCellphone(cellphone)

    if (deliveryManByCellphone) {
      return left(
        new UserWithSameCellphoneError(
          'Already exists an user with same cellphone.',
        ),
      )
    }

    const passwordHashed = await this.hashCreator.create(password)

    const admin = Admin.create({
      name,
      individualRegistration: Mask.takeOffFromText(individualRegistration),
      cellphone: Mask.takeOffFromText(cellphone),
      email,
      password: passwordHashed,
    })

    await this.adminsRepository.create(admin)

    return right({
      item: admin,
    })
  }
}
