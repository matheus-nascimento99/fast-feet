import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'

import { Recipient } from '../../enterprise/entities/recipient'
import { HashCreator } from '../hash/hash-creator'
import { RecipientsRepository } from '../repositories/recipient'
import { UserWithSameCellphoneError } from './errors/user-with-same-cellphone'
import { UserWithSameEmailError } from './errors/user-with-same-email'
import { UserWithSameIndividualRegistrationError } from './errors/user-with-same-individual-registration'

interface CreateRecipientUseCaseRequest {
  name: string
  individualRegistration: string
  cellphone: string
  email: string
  password: string
}

type CreateRecipientUseCaseResponse = Either<
  {
    item: Recipient
  },
  | UserWithSameEmailError
  | UserWithSameIndividualRegistrationError
  | UserWithSameCellphoneError
>
@Injectable()
export class CreateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private hashCreator: HashCreator,
  ) {}

  async execute({
    name,
    individualRegistration,
    cellphone,
    email,
    password,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const deliveryManByEmail =
      await this.recipientsRepository.findByEmail(email)

    if (deliveryManByEmail) {
      return left(
        new UserWithSameEmailError('Already exists an user with same email.'),
      )
    }

    const deliveryManByIndividualRegistration =
      await this.recipientsRepository.findByIndividualRegistration(
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
      await this.recipientsRepository.findByCellphone(cellphone)

    if (deliveryManByCellphone) {
      return left(
        new UserWithSameCellphoneError(
          'Already exists an user with same cellphone.',
        ),
      )
    }

    const passwordHashed = await this.hashCreator.create(password)

    const recipient = Recipient.create({
      name,
      individualRegistration: Mask.takeOffFromText(individualRegistration),
      cellphone: Mask.takeOffFromText(cellphone),
      email,
      password: passwordHashed,
    })

    await this.recipientsRepository.create(recipient)

    return right({
      item: recipient,
    })
  }
}
