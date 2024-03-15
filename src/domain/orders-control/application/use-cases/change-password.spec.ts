import { makeAdmin } from 'test/factories/make-admin'
import { FakeHasher } from 'test/hash/fake-hasher'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admin'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ChangePasswordUseCase } from './change-password'

let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHashCreator: FakeHasher
let sut: ChangePasswordUseCase

const USER_NEW_PASSWORD = 'test'

describe('Change password use case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    fakeHashCreator = new FakeHasher()

    sut = new ChangePasswordUseCase(
      inMemoryAdminsRepository,
      inMemoryDeliveryMenRepository,
      fakeHashCreator,
    )
  })

  it('should be able to change password of an admin', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      userId: admin.id.toString(),
      newPassword: USER_NEW_PASSWORD,
    })

    const isPasswordsEquals =
      USER_NEW_PASSWORD.concat('-hashed') ===
      inMemoryAdminsRepository.items[0].password

    expect(result.isRight()).toEqual(true)
    expect(isPasswordsEquals).toEqual(true)
  })

  it('should not be able to change password of an inexistent admin', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      userId: 'inexistent-admin-id',
      newPassword: USER_NEW_PASSWORD,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
