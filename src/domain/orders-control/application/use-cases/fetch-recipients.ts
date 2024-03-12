/* eslint-disable @typescript-eslint/no-empty-interface */
import { Either, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'

import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipient'

type FetchRecipientsUseCaseRequest = PaginationParams

type FetchRecipientsUseCaseResponse = Either<
  {
    items: Recipient[]
  },
  null
>

export class FetchRecipientsUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    page,
    limit,
  }: FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const recipients = await this.recipientsRepository.findMany({
      page,
      limit,
    })

    return right({
      items: recipients,
    })
  }
}
