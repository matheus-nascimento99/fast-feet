import { faker } from '@faker-js/faker'
import { makeAddress } from 'test/factories/make-address'
import { makeRecipient } from 'test/factories/make-recipient'
import { FakeHasher } from 'test/hash/fake-hasher'
import { InMemoryAdressesRepository } from 'test/repositories/in-memory-address'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { CreateRecipientUseCase } from './create-recipient'
import { InvalidAddressAmountPerRecipientError } from './errors/invalid-address-amount-per-recipient'
import { RecipientWithNoOneAddressError } from './errors/recipient-with-no-one-address'
import { UserWithSameCellphoneError } from './errors/user-with-same-cellphone'
import { UserWithSameEmailError } from './errors/user-with-same-email'
import { UserWithSameIndividualRegistrationError } from './errors/user-with-same-individual-registration'

let sut: CreateRecipientUseCase
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdressesRepository: InMemoryAdressesRepository
let fakeHasher: FakeHasher

describe('Create recipient use case', () => {
  beforeEach(() => {
    inMemoryAdressesRepository = new InMemoryAdressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryAdressesRepository,
    )
    fakeHasher = new FakeHasher()
    sut = new CreateRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryAdressesRepository,
      fakeHasher,
    )
  })

  it('should be able to create a recipient', async () => {
    const adresses = Array.from({ length: 2 }).map(() => {
      const address = makeAddress()
      inMemoryAdressesRepository.create(address)

      return address.id.toString()
    })

    const { value } = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: '+551195119-5312',
      email: 'mnsergio59@gmail.com',
      password: await fakeHasher.create(faker.internet.password()),
      adresses,
    })

    expect(value).toEqual({
      item: expect.objectContaining({
        name: expect.any(String),
        adresses: expect.objectContaining({
          currentItems: expect.arrayContaining([
            expect.objectContaining({ id: new UniqueEntityId(adresses[0]) }),
            expect.objectContaining({ id: new UniqueEntityId(adresses[1]) }),
          ]),
        }),
      }),
    })
  })

  it('should not be able to create an recipient with same individual registration from another user', async () => {
    const recipient = makeRecipient()
    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: recipient.individualRegistration.value,
      cellphone: '+551195119-5312',
      email: 'mnsergio59@gmail.com',
      password: 'matheus123',
      adresses: [],
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UserWithSameIndividualRegistrationError)
  })

  it('should not be able to create an recipient with same cellphone from another user', async () => {
    const recipient = makeRecipient()
    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: recipient.cellphone.value,
      email: 'mnsergio59@gmail.com',
      password: 'matheus123',
      adresses: [],
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UserWithSameCellphoneError)
  })

  it('should not be able to create a recipient with same email from another user', async () => {
    const recipient = makeRecipient()
    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: '+551195119-5312',
      email: recipient.email,
      password: 'matheus123',
      adresses: [],
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UserWithSameEmailError)
  })

  it('should be able to hash recipient password', async () => {
    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: '+551195119-5312',
      email: 'mnsergio59@gmail.com',
      password: 'matheus123',
      adresses: [faker.string.uuid()],
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryRecipientsRepository.items[0].password).toEqual(
      'matheus123-hashed',
    )
  })

  it('should not be able to create a recipient with no one address', async () => {
    const recipient = makeRecipient()
    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: '+551195119-5312',
      email: 'mnsergio59@mail.com',
      password: 'matheus123',
      adresses: [],
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(RecipientWithNoOneAddressError)
  })

  it('should not be able to create a recipient with more than ten adresses', async () => {
    const adresses = Array.from({ length: 11 }).map(() => {
      return faker.string.uuid()
    })

    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: '+551195119-5312',
      email: 'mnsergio59@mail.com',
      password: 'matheus123',
      adresses,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(InvalidAddressAmountPerRecipientError)
  })
})
