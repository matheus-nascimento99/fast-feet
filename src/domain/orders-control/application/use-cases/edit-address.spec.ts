import { faker } from '@faker-js/faker'
import { makeAddress } from 'test/factories/make-address'
import { InMemoryAdressesRepository } from 'test/repositories/in-memory-address'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Mask } from '../../enterprise/entities/value-objects/mask'
import { EditAddressUseCase } from './edit-address'

let inMemoryAdressesRepository: InMemoryAdressesRepository
let sut: EditAddressUseCase

describe('Edit address use case', () => {
  beforeEach(() => {
    inMemoryAdressesRepository = new InMemoryAdressesRepository()
    sut = new EditAddressUseCase(inMemoryAdressesRepository)
  })

  it('should be able to edit an address', async () => {
    const address = makeAddress()
    inMemoryAdressesRepository.create(address)

    const newAddress = {
      postalCode: faker.location.zipCode(),
      street: faker.location.streetAddress(),
      streetNumber: faker.number.int(1000),
      complement: faker.lorem.sentence(10),
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state(),
    }

    const result = await sut.execute({
      addressId: address.id.toString(),
      ...newAddress,
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryAdressesRepository.items).toHaveLength(1)
    expect(inMemoryAdressesRepository.items[0]).toMatchObject({
      postalCode: Mask.takeOffFromText(newAddress.postalCode),
    })
  })

  it('should not be able to edit an unexistent address', async () => {
    const result = await sut.execute({
      addressId: faker.string.uuid(),
      postalCode: faker.location.zipCode(),
      street: faker.location.streetAddress(),
      streetNumber: faker.number.int(1000),
      complement: faker.lorem.sentence(10),
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
