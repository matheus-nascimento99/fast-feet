import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'

import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { HashCreator } from '../hash/hash-creator'
import { DeliveryMenRepository } from '../repositories/delivery-man'
import { UserWithSameCellphoneError } from './errors/user-with-same-cellphone'
import { UserWithSameEmailError } from './errors/user-with-same-email'
import { UserWithSameIndividualRegistrationError } from './errors/user-with-same-individual-registration'

interface CreateDeliveryManUseCaseRequest {
  name: string
  individualRegistration: string
  email: string
  cellphone: string
  password: string
}

export type CreateDeliveryManUseCaseResponse = Either<
  {
    item: DeliveryMan
  },
  | UserWithSameEmailError
  | UserWithSameIndividualRegistrationError
  | UserWithSameCellphoneError
>
@Injectable()
export class CreateDeliveryManUseCase {
  constructor(
    private deliveryMenRepository: DeliveryMenRepository,
    private hashCreator: HashCreator,
  ) {}

  async execute({
    name,
    individualRegistration,
    cellphone,
    email,
    password,
  }: CreateDeliveryManUseCaseRequest): Promise<CreateDeliveryManUseCaseResponse> {
    const deliveryManByEmail =
      await this.deliveryMenRepository.findByEmail(email)

    if (deliveryManByEmail) {
      return left(
        new UserWithSameEmailError('Already exists an user with same email.'),
      )
    }

    const deliveryManByIndividualRegistration =
      await this.deliveryMenRepository.findByIndividualRegistration(
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
      await this.deliveryMenRepository.findByCellphone(cellphone)

    if (deliveryManByCellphone) {
      return left(
        new UserWithSameCellphoneError(
          'Already exists an user with same cellphone.',
        ),
      )
    }

    const passwordHashed = await this.hashCreator.create(password)

    const deliveryMan = DeliveryMan.create({
      name,
      individualRegistration: Mask.takeOffFromText(individualRegistration),
      cellphone: Mask.takeOffFromText(cellphone),
      email,
      password: passwordHashed,
    })

    await this.deliveryMenRepository.create(deliveryMan)

    return right({
      item: deliveryMan,
    })
  }
}
