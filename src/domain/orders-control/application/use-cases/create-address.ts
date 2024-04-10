import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Address } from '../../enterprise/entities/address'
import { Mask } from '../../enterprise/entities/value-objects/mask'
import { AdressesRepository } from '../repositories/address'

type CreateAddressUseCaseRequest = {
  postalCode: string
  street: string
  streetNumber: number
  complement?: string
  neighborhood: string
  city: string
  state: string
  principal?: boolean
}

type CreateAddressUseCaseResponse = Either<
  {
    item: string
  },
  null
>
@Injectable()
export class CreateAddressUseCase {
  constructor(private adressesRepository: AdressesRepository) {}

  async execute({
    postalCode,
    ...rest
  }: CreateAddressUseCaseRequest): Promise<CreateAddressUseCaseResponse> {
    const address = Address.create({
      ...rest,
      postalCode: Mask.takeOffFromText(postalCode),
    })

    await this.adressesRepository.create(address)

    return right({
      item: address.id.toString(),
    })
  }
}
