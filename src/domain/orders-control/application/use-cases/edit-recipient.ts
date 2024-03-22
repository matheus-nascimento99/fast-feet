/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common'

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
}

type EditRecipientUseCaseResponse = Either<unknown, ResourceNotFoundError>
@Injectable()
export class EditRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    individualRegistration,
    cellphone,
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

    await this.recipientsRepository.save(recipient.id, recipient)

    return right({})
  }
}
