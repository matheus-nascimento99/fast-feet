import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'

import { Recipient } from '../../enterprise/entities/recipient'
import { HashCreator } from '../hash/hash-creator'
import { AdressesRepository } from '../repositories/address'
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
  adresses: string[]
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
    private adressesRepository: AdressesRepository,
    private hashCreator: HashCreator,
  ) {}

  async execute({
    name,
    individualRegistration,
    cellphone,
    email,
    password,
    adresses,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipientByEmail = await this.recipientsRepository.findByEmail(email)

    if (recipientByEmail) {
      return left(
        new UserWithSameEmailError('Already exists an user with same email.'),
      )
    }

    const recipientByIndividualRegistration =
      await this.recipientsRepository.findByIndividualRegistration(
        individualRegistration,
      )

    if (recipientByIndividualRegistration) {
      return left(
        new UserWithSameIndividualRegistrationError(
          'Already exists an user with same individual registration.',
        ),
      )
    }

    const recipientByCellphone =
      await this.recipientsRepository.findByCellphone(cellphone)

    if (recipientByCellphone) {
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

    for (const addressId of adresses) {
      const address = await this.adressesRepository.findById(
        new UniqueEntityId(addressId),
      )

      if (address) {
        address.recipientId = recipient.id
        recipient.adresses.add(address)
      }
    }

    await this.recipientsRepository.create(recipient)

    return right({
      item: recipient,
    })
  }
}
