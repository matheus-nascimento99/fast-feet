import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'

import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipient'

interface CreateRecipientUseCaseRequest {
  name: string
  individualRegistration: string
  cellphone: string
  email: string
  postalCode: string
  street: string
  streetNumber: number
  complement?: string | null
  neighborhood: string
  city: string
  state: string
}

type CreateRecipientUseCaseResponse = Either<
  {
    item: Recipient
  },
  null
>
@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    name,
    individualRegistration,
    cellphone,
    email,
    postalCode,
    street,
    streetNumber,
    complement,
    neighborhood,
    city,
    state,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipient = Recipient.create({
      name,
      individualRegistration: Mask.takeOffFromText(individualRegistration),
      cellphone: Mask.takeOffFromText(cellphone),
      email,
      postalCode: Mask.takeOffFromText(postalCode),
      street,
      streetNumber,
      complement,
      neighborhood,
      city,
      state,
    })

    await this.recipientsRepository.create(recipient)

    return right({
      item: recipient,
    })
  }
}
