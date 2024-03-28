import { makeAdmin } from 'test/factories/make-admin'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { makeRecipient } from 'test/factories/make-recipient'
import { FakeHasher } from 'test/hash/fake-hasher'
import { InMemoryAdressesRepository } from 'test/repositories/in-memory-address'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admin'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ChangePasswordUseCase } from './change-password'

let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdressesRepository: InMemoryAdressesRepository
let fakeHashCreator: FakeHasher
let sut: ChangePasswordUseCase

const USER_NEW_PASSWORD = 'test'

describe('Change password use case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryAdressesRepository = new InMemoryAdressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryAdressesRepository,
    )
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    fakeHashCreator = new FakeHasher()

    sut = new ChangePasswordUseCase(
      inMemoryAdminsRepository,
      inMemoryDeliveryMenRepository,
      inMemoryRecipientsRepository,
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

  it('should be able to change password of a delivery man', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      userId: deliveryMan.id.toString(),
      newPassword: USER_NEW_PASSWORD,
    })

    const isPasswordsEquals =
      USER_NEW_PASSWORD.concat('-hashed') ===
      inMemoryDeliveryMenRepository.items[0].password

    expect(result.isRight()).toEqual(true)
    expect(isPasswordsEquals).toEqual(true)
  })

  it('should not be able to change password of an inexistent delivery man', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      userId: 'inexistent-delivery-man-id',
      newPassword: USER_NEW_PASSWORD,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to change password of a recipient', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      userId: recipient.id.toString(),
      newPassword: USER_NEW_PASSWORD,
    })

    const isPasswordsEquals =
      USER_NEW_PASSWORD.concat('-hashed') ===
      inMemoryRecipientsRepository.items[0].password

    expect(result.isRight()).toEqual(true)
    expect(isPasswordsEquals).toEqual(true)
  })

  it('should not be able to change password of an inexistent recipient', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      userId: 'inexistent-recipient-id',
      newPassword: USER_NEW_PASSWORD,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
