import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Mask } from '../../enterprise/entities/value-objects/mask'
import { AdressesRepository } from '../repositories/address'

type EditAddressUseCaseRequest = {
  addressId: string
  postalCode: string
  street: string
  streetNumber: number
  complement?: string
  neighborhood: string
  city: string
  state: string
  principal?: boolean
}

type EditAddressUseCaseResponse = Either<unknown, ResourceNotFoundError>

@Injectable()
export class EditAddressUseCase {
  constructor(private adressesRepository: AdressesRepository) {}

  async execute({
    addressId,
    postalCode,
    ...rest
  }: EditAddressUseCaseRequest): Promise<EditAddressUseCaseResponse> {
    const address = await this.adressesRepository.findById(
      new UniqueEntityId(addressId),
    )

    if (!address) {
      return left(new ResourceNotFoundError('Address not found.'))
    }

    for (const [key, value] of Object.entries(rest) as [
      keyof typeof rest,
      never,
    ][]) {
      address[key] = value
    }

    address.postalCode = Mask.takeOffFromText(postalCode)

    await this.adressesRepository.save(address.id, address)

    return right({})
  }
}
