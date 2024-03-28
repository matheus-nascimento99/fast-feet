/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Address } from '../../enterprise/entities/address'
import { AddressList } from '../../enterprise/entities/address-list'
import { Mask } from '../../enterprise/entities/value-objects/mask'
import { AdressesRepository } from '../repositories/address'
import { RecipientsRepository } from '../repositories/recipient'
import { UserWithSameCellphoneError } from './errors/user-with-same-cellphone'
import { UserWithSameEmailError } from './errors/user-with-same-email'
import { UserWithSameIndividualRegistrationError } from './errors/user-with-same-individual-registration'

interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  individualRegistration: string
  email: string
  cellphone: string
  adresses: string[]
}

type EditRecipientUseCaseResponse = Either<unknown, ResourceNotFoundError>
@Injectable()
export class EditRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private adressesRepository: AdressesRepository,
  ) {}

  async execute({
    recipientId,
    individualRegistration,
    cellphone,
    adresses,
    ...rest
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError('Recipient not found.'))
    }

    const recipientByEmail = await this.recipientsRepository.findByEmail(
      rest.email,
    )

    if (recipientByEmail && !recipientByEmail.id.equals(recipient.id)) {
      return left(
        new UserWithSameEmailError('Already exists an user with same email.'),
      )
    }

    const recipientByIndividualRegistration =
      await this.recipientsRepository.findByIndividualRegistration(
        individualRegistration,
      )

    if (
      recipientByIndividualRegistration &&
      !recipientByIndividualRegistration.id.equals(recipient.id)
    ) {
      return left(
        new UserWithSameIndividualRegistrationError(
          'Already exists an user with same individual registration.',
        ),
      )
    }

    const recipientByCellphone =
      await this.recipientsRepository.findByCellphone(cellphone)

    if (recipientByCellphone && !recipientByCellphone.id.equals(recipient.id)) {
      return left(
        new UserWithSameCellphoneError(
          'Already exists an user with same cellphone.',
        ),
      )
    }

    for (const [key, value] of Object.entries(rest) as [
      keyof typeof rest,
      never,
    ][]) {
      recipient[key] = value
    }

    recipient.individualRegistration = Mask.takeOffFromText(
      individualRegistration,
    )
    recipient.cellphone = Mask.takeOffFromText(cellphone)

    const currentAdresses = await this.adressesRepository.findManyByRecipientId(
      recipient.id,
    )

    const currentAdressesList = new AddressList(currentAdresses)

    const newAdresses: Address[] = []

    for (const addressId of adresses) {
      const address = await this.adressesRepository.findById(
        new UniqueEntityId(addressId),
      )

      if (address) {
        address.recipientId = recipient.id
        newAdresses.push(address)
      }
    }

    currentAdressesList.update(newAdresses)

    recipient.adresses = currentAdressesList

    await this.recipientsRepository.save(recipient.id, recipient)

    return right({})
  }
}
