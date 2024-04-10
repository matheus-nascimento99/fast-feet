import { faker } from '@faker-js/faker'
import { makeAddress } from 'test/factories/make-address'
import { InMemoryAdressesRepository } from 'test/repositories/in-memory-address'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DeleteAddressUseCase } from './delete-address'

let inMemoryAdressesRepository: InMemoryAdressesRepository
let sut: DeleteAddressUseCase

describe('Delete address use case', () => {
  beforeEach(() => {
    inMemoryAdressesRepository = new InMemoryAdressesRepository()
    sut = new DeleteAddressUseCase(inMemoryAdressesRepository)
  })

  it('should be able to delete an address', async () => {
    const address = makeAddress()
    inMemoryAdressesRepository.create(address)

    const result = await sut.execute({
      addressId: address.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryAdressesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an unexistent address', async () => {
    const result = await sut.execute({
      addressId: faker.string.uuid(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
