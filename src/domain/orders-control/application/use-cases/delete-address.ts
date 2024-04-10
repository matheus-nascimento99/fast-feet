import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { AdressesRepository } from '../repositories/address'

type DeleteAddressUseCaseRequest = {
  addressId: string
}

type DeleteAddressUseCaseResponse = Either<unknown, ResourceNotFoundError>
@Injectable()
export class DeleteAddressUseCase {
  constructor(private adressesRepository: AdressesRepository) {}

  async execute({
    addressId,
  }: DeleteAddressUseCaseRequest): Promise<DeleteAddressUseCaseResponse> {
    const address = await this.adressesRepository.findById(
      new UniqueEntityId(addressId),
    )

    if (!address) {
      return left(new ResourceNotFoundError('Address not found.'))
    }

    await this.adressesRepository.delete(address.id)

    return right({})
  }
}
