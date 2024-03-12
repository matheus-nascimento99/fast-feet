/* eslint-disable @typescript-eslint/no-empty-interface */
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Mask } from '../../enterprise/entities/value-objects/mask'
import { RecipientsRepository } from '../repositories/recipient'

interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  individualRegistration: string
  email: string
  cellphone: string
  postalCode: string
  street: string
  streetNumber: number
  complement?: string | null
  neighborhood: string
  city: string
  state: string
}

type EditRecipientUseCaseResponse = Either<unknown, ResourceNotFoundError>

export class EditRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    individualRegistration,
    cellphone,
    postalCode,
    ...rest
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError('Recipient not found.'))
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
    recipient.postalCode = Mask.takeOffFromText(postalCode)

    await this.recipientsRepository.save(recipient.id, recipient)

    return right({})
  }
}
