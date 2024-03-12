import { compare } from 'bcryptjs'
import { makeAdmin } from 'test/factories/make-admin'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admin'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ChangePasswordUseCase } from './change-password'

let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: ChangePasswordUseCase

const USER_NEW_PASSWORD = 'test'

describe('Change password use case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new ChangePasswordUseCase(
      inMemoryAdminsRepository,
      inMemoryDeliveryMenRepository,
    )
  })

  it('should be able to change password of an admin', async () => {
    const admin = await makeAdmin()
    inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      userId: admin.id.toString(),
      newPassword: USER_NEW_PASSWORD,
    })

    const isPasswordsEquals = await compare(
      USER_NEW_PASSWORD,
      inMemoryAdminsRepository.items[0].password,
    )

    expect(result.isRight()).toEqual(true)
    expect(isPasswordsEquals).toEqual(true)
  })

  it('should be able to change password of a delivery man', async () => {
    const deliveryMan = await makeAdmin()
    inMemoryAdminsRepository.create(deliveryMan)

    const result = await sut.execute({
      userId: deliveryMan.id.toString(),
      newPassword: USER_NEW_PASSWORD,
    })

    const isPasswordsEquals = await compare(
      USER_NEW_PASSWORD,
      inMemoryAdminsRepository.items[0].password,
    )

    expect(result.isRight()).toEqual(true)
    expect(isPasswordsEquals).toEqual(true)
  })

  it('should not be able to change password of an inexistent admin', async () => {
    const admin = await makeAdmin()
    inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      userId: 'inexistent-admin-id',
      newPassword: USER_NEW_PASSWORD,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to change password with an inexistent delivery man', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryAdminsRepository.create(deliveryMan)

    const result = await sut.execute({
      userId: 'inexistent-delivery-man-id',
      newPassword: USER_NEW_PASSWORD,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
