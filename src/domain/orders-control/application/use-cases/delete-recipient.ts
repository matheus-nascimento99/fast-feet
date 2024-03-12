/* eslint-disable @typescript-eslint/no-empty-interface */
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { RecipientsRepository } from '../repositories/recipient'

interface DeleteRecipientUseCaseRequest {
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<unknown, ResourceNotFoundError>

export class DeleteRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError('Recipient not found.'))
    }

    await this.recipientsRepository.delete(recipient.id)

    return right({})
  }
}
