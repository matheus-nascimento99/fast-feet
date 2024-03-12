import { makeAdmin } from 'test/factories/make-admin'
import { FakeHasher } from 'test/hash/fake-hasher'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admin'

import { CreateAdminUseCase } from './create-admin'
import { UserWithSameCellphoneError } from './errors/user-with-same-cellphone'
import { UserWithSameEmailError } from './errors/user-with-same-email'
import { UserWithSameIndividualRegistrationError } from './errors/user-with-same-individual-registration'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: CreateAdminUseCase

describe('Create admin use case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateAdminUseCase(inMemoryAdminsRepository, fakeHasher)
  })

  it('should be able to create an admin', async () => {
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

  it('should not be able to create an admin with same individual registration from another user', async () => {
    const admin = makeAdmin()
    await inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: admin.individualRegistration.value,
      cellphone: '+551195119-5312',
      email: 'mnsergio59@gmail.com',
      password: 'matheus123',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UserWithSameIndividualRegistrationError)
  })

  it('should not be able to create an admin with same cellphone from another user', async () => {
    const admin = makeAdmin()
    await inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: admin.cellphone.value,
      email: 'mnsergio59@gmail.com',
      password: 'matheus123',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UserWithSameCellphoneError)
  })

  it('should not be able to create an admin with same email from another user', async () => {
    const admin = makeAdmin()
    await inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: '+551195119-5312',
      email: admin.email,
      password: 'matheus123',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UserWithSameEmailError)
  })

  it('should be able to hash admin password', async () => {
    const result = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: '+551195119-5312',
      email: 'mnsergio59@gmail.com',
      password: 'matheus123',
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryAdminsRepository.items[0].password).toEqual(
      'matheus123-hashed',
    )
  })
})
