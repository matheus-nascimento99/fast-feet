import { FakeCryptographer } from 'test/cryptography/fake-cryptographer'
import { makeAdmin } from 'test/factories/make-admin'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { makeRecipient } from 'test/factories/make-recipient'
import { FakeHasher } from 'test/hash/fake-hasher'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admin'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { NotAuthorizedError } from '@/core/errors/not-authorized-error'

import { Mask } from '../../enterprise/entities/value-objects/mask'
import { AuthenticateUseCase } from './authenticate'

let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let fakeHasher: FakeHasher
let fakeCryptographer: FakeCryptographer
let sut: AuthenticateUseCase

const USER_INDIVIDUAL_REGISTRATION = '456.143.238-80'
const USER_PASSWORD = 'test'

describe('Authenticate use case', () => {
  let password: string

  beforeEach(async () => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    fakeHasher = new FakeHasher()
    fakeCryptographer = new FakeCryptographer()

    sut = new AuthenticateUseCase(
      inMemoryAdminsRepository,
      inMemoryDeliveryMenRepository,
      inMemoryRecipientsRepository,
      fakeHasher,
      fakeCryptographer,
    )

    password = await fakeHasher.create(USER_PASSWORD)
  })

  it('should be able to authenticate with an admin', async () => {
    const admin = makeAdmin({
      individualRegistration: Mask.takeOffFromText(
        USER_INDIVIDUAL_REGISTRATION,
      ),
      password,
    })

    inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      individualRegistration: USER_INDIVIDUAL_REGISTRATION,
      password: USER_PASSWORD,
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toMatchObject({
      accessToken: expect.any(String),
    })
  })

  it('should be able to authenticate with an delivery man', async () => {
    const deliveryMan = makeDeliveryMan({
      individualRegistration: Mask.takeOffFromText(
        USER_INDIVIDUAL_REGISTRATION,
      ),
      password,
    })

    inMemoryDeliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      individualRegistration: USER_INDIVIDUAL_REGISTRATION,
      password: USER_PASSWORD,
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toMatchObject({
      accessToken: expect.any(String),
    })
  })

  it('should be able to authenticate with a recipient', async () => {
    const recipient = makeRecipient({
      individualRegistration: Mask.takeOffFromText(
        USER_INDIVIDUAL_REGISTRATION,
      ),
      password,
    })

    inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      individualRegistration: USER_INDIVIDUAL_REGISTRATION,
      password: USER_PASSWORD,
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toMatchObject({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with an inexistent admin', async () => {
    const admin = makeAdmin({
      individualRegistration: Mask.takeOffFromText(
        USER_INDIVIDUAL_REGISTRATION,
      ),
      password,
    })

    inMemoryDeliveryMenRepository.create(admin)

    const result = await sut.execute({
      individualRegistration: 'inexistent-admin-individual-registration',
      password: USER_PASSWORD,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })

  it('should not be able to authenticate with an inexistent delivery man', async () => {
    const deliveryMan = makeDeliveryMan({
      individualRegistration: Mask.takeOffFromText(
        USER_INDIVIDUAL_REGISTRATION,
      ),
      password,
    })

    inMemoryDeliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      individualRegistration: 'inexistent-delivery-man-individual-registration',
      password: USER_PASSWORD,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })

  it('should not be able to authenticate with an inexistent recipient', async () => {
    const recipient = makeRecipient({
      individualRegistration: Mask.takeOffFromText(
        USER_INDIVIDUAL_REGISTRATION,
      ),
      password,
    })

    inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      individualRegistration: 'inexistent-recipient-individual-registration',
      password: USER_PASSWORD,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })

  it('should not be able to authenticate an admin with wrong password', async () => {
    const admin = makeAdmin({
      individualRegistration: Mask.takeOffFromText(
        USER_INDIVIDUAL_REGISTRATION,
      ),
      password,
    })

    inMemoryDeliveryMenRepository.create(admin)

    const result = await sut.execute({
      individualRegistration: admin.individualRegistration.value,
      password: 'inexistent-admin-password',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })

  it('should not be able to authenticate a delivery man with a wrong password', async () => {
    const deliveryMan = makeDeliveryMan({
      individualRegistration: Mask.takeOffFromText(
        USER_INDIVIDUAL_REGISTRATION,
      ),
      password,
    })

    inMemoryDeliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      individualRegistration: deliveryMan.individualRegistration.value,
      password: 'inecistent-delivery-man-password',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })

  it('should not be able to authenticate a recipient with a wrong password', async () => {
    const recipient = makeRecipient({
      individualRegistration: Mask.takeOffFromText(
        USER_INDIVIDUAL_REGISTRATION,
      ),
      password,
    })

    inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      individualRegistration: recipient.individualRegistration.value,
      password: 'inecistent-recipient-password',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })
})
