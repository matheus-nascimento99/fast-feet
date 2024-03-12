import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { FakeHasher } from 'test/hash/fake-hasher'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'

import { CreateDeliveryManUseCase } from './create-delivery-man'
import { UserWithSameCellphoneError } from './errors/user-with-same-cellphone'
import { UserWithSameEmailError } from './errors/user-with-same-email'
import { UserWithSameIndividualRegistrationError } from './errors/user-with-same-individual-registration'

let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let fakeHasher: FakeHasher
let sut: CreateDeliveryManUseCase

describe('Create delivery man use case', () => {
  beforeEach(() => {
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateDeliveryManUseCase(
      inMemoryDeliveryMenRepository,
      fakeHasher,
    )
  })

  it('should be able to create a delivery man', async () => {
    const { value } = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: '+551195119-5312',
      email: 'mnsergio59@gmail.com',
      password: 'matheus123',
    })

    expect(value).toEqual({
      item: expect.objectContaining({ name: expect.any(String) }),
    })
  })

  it('should not be able to create an delivery man with same individual registration from another user', async () => {
    const deliveryMan = makeDeliveryMan()
    await inMemoryDeliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: deliveryMan.individualRegistration.value,
      cellphone: '+551195119-5312',
      email: 'mnsergio59@gmail.com',
      password: 'matheus123',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UserWithSameIndividualRegistrationError)
  })

  it('should not be able to create an delivery man with same cellphone from another user', async () => {
    const deliveryMan = makeDeliveryMan()
    await inMemoryDeliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: deliveryMan.cellphone.value,
      email: 'mnsergio59@gmail.com',
      password: 'matheus123',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UserWithSameCellphoneError)
  })

  it('should not be able to create an delivery man with same email from another user', async () => {
    const deliveryMan = makeDeliveryMan()
    await inMemoryDeliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: '+551195119-5312',
      email: deliveryMan.email,
      password: 'matheus123',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UserWithSameEmailError)
  })

  it('should be able to hash delivery man password', async () => {
    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: '+551195119-5312',
      email: 'mnsergio59@gmail.com',
      password: 'matheus123',
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryDeliveryMenRepository.items[0].password).toEqual(
      'matheus123-hashed',
    )
  })
})
