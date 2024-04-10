import { faker } from '@faker-js/faker'
import { InMemoryAdressesRepository } from 'test/repositories/in-memory-address'

import { CreateAddressUseCase } from './create-address'

let inMemoryAdressesRepository: InMemoryAdressesRepository
let sut: CreateAddressUseCase

describe('Create address use case', () => {
  beforeEach(() => {
    inMemoryAdressesRepository = new InMemoryAdressesRepository()
    sut = new CreateAddressUseCase(inMemoryAdressesRepository)
  })

  it('should be able to create a new address', async () => {
    const result = await sut.execute({
      postalCode: faker.location.zipCode(),
      street: faker.location.streetAddress(),
      streetNumber: faker.number.int(1000),
      complement: faker.lorem.sentence(10),
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value?.item).toEqual(expect.any(String))
    expect(inMemoryAdressesRepository.items).toHaveLength(1)
  })
})
