import { faker } from '@faker-js/faker'
import { makeRecipient } from 'test/factories/make-recipient'
import { FakeHasher } from 'test/hash/fake-hasher'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { CreateRecipientUseCase } from './create-recipient'
import { UserWithSameCellphoneError } from './errors/user-with-same-cellphone'
import { UserWithSameEmailError } from './errors/user-with-same-email'
import { UserWithSameIndividualRegistrationError } from './errors/user-with-same-individual-registration'

let sut: CreateRecipientUseCase
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let fakeHasher: FakeHasher

describe('Create recipient use case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateRecipientUseCase(inMemoryRecipientsRepository, fakeHasher)
  })

  it('should be able to create a recipient', async () => {
    const { value } = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: '+551195119-5312',
      email: 'mnsergio59@gmail.com',
      password: await fakeHasher.create(faker.internet.password()),
    })

    expect(value).toEqual({
      item: expect.objectContaining({ name: expect.any(String) }),
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
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryRecipientsRepository.items[0].password).toEqual(
      'matheus123-hashed',
    )
  })
})
