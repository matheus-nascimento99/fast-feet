import { makeAddress } from 'test/factories/make-address'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryAdressesRepository } from 'test/repositories/in-memory-address'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { AddressList } from '../../enterprise/entities/address-list'
import { EditRecipientUseCase } from './edit-recipient'
import { UserWithSameCellphoneError } from './errors/user-with-same-cellphone'
import { UserWithSameEmailError } from './errors/user-with-same-email'
import { UserWithSameIndividualRegistrationError } from './errors/user-with-same-individual-registration'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdressesRepository: InMemoryAdressesRepository
let sut: EditRecipientUseCase

describe('Edit recipient use case', () => {
  beforeEach(() => {
    inMemoryAdressesRepository = new InMemoryAdressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryAdressesRepository,
    )
    sut = new EditRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryAdressesRepository,
    )
  })

  it('should be able to edit a recipient', async () => {
    const recipient = makeRecipient()

    const createAdresses = Array.from({ length: 2 }).map(() => {
      const address = makeAddress({ recipientId: recipient.id })
      return address
    })

    recipient.adresses = new AddressList(createAdresses)

    inMemoryRecipientsRepository.create(recipient)

    const createNewAdresses = Array.from({ length: 2 }).map(() => {
      const address = makeAddress({ recipientId: recipient.id })
      inMemoryAdressesRepository.create(address)

      return address.id.toString()
    })

    const adresses = [createAdresses[0].id.toString(), ...createNewAdresses]

    await sut.execute({
      recipientId: recipient.id.toString(),
      name: 'example-name-updated',
      individualRegistration: '123.456.789-10',
      email: 'example-email-updated@mail.com',
      cellphone: '+551198425-1086',
      adresses,
    })

    expect(inMemoryRecipientsRepository.items[0]).toMatchObject({
      name: 'example-name-updated',
      adresses: expect.objectContaining({
        currentItems: expect.arrayContaining([
          expect.objectContaining({
            id: new UniqueEntityId(createAdresses[0].id.toString()),
          }),
          expect.objectContaining({
            id: new UniqueEntityId(createNewAdresses[0]),
          }),
          expect.objectContaining({
            id: new UniqueEntityId(createNewAdresses[1]),
          }),
        ]),
      }),
    })
    expect(inMemoryAdressesRepository.items).toHaveLength(3)
    expect(inMemoryAdressesRepository.items).toEqual([
      expect.objectContaining({
        id: new UniqueEntityId(createAdresses[0].id.toString()),
      }),
      expect.objectContaining({
        id: new UniqueEntityId(createNewAdresses[0]),
      }),
      expect.objectContaining({
        id: new UniqueEntityId(createNewAdresses[1]),
      }),
    ])
  })

  it('should be not able to edit a recipient with an inexistent recipient', async () => {
    const recipientId = 'example-recipient-id'
    const recipientInexistentId = 'example-recipient-id-inexistent'

    const recipient = makeRecipient({}, new UniqueEntityId(recipientId))

    inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      recipientId: recipientInexistentId,
      name: 'example-name-updated',
      individualRegistration: '123.456.789-10',
      email: 'example-email-updated@mail.com',
      cellphone: '+551198425-1086',
      adresses: [],
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a recipient with same individual registration from another user', async () => {
    const recipient1 = makeRecipient()
    inMemoryRecipientsRepository.create(recipient1)

    const recipient2 = makeRecipient()
    inMemoryRecipientsRepository.create(recipient2)

    const result = await sut.execute({
      recipientId: recipient1.id.toString(),
      name: 'example-name-updated',
      individualRegistration: recipient2.individualRegistration.value,
      email: 'example-email-updated@mail.com',
      cellphone: '+551198425-1086',
      adresses: [],
    })

    expect(result.value).toBeInstanceOf(UserWithSameIndividualRegistrationError)
  })

  it('should not be able to edit a recipient with same cellphone from another user', async () => {
    const recipient1 = makeRecipient()
    inMemoryRecipientsRepository.create(recipient1)

    const recipient2 = makeRecipient()
    inMemoryRecipientsRepository.create(recipient2)

    const result = await sut.execute({
      recipientId: recipient1.id.toString(),
      name: 'example-name-updated',
      individualRegistration: '456.143.238.80',
      email: 'example-email-updated@mail.com',
      cellphone: recipient2.cellphone.value,
      adresses: [],
    })

    expect(result.value).toBeInstanceOf(UserWithSameCellphoneError)
  })

  it('should not be able to create a recipient with same email from another user', async () => {
    const recipient1 = makeRecipient()
    inMemoryRecipientsRepository.create(recipient1)

    const recipient2 = makeRecipient()
    inMemoryRecipientsRepository.create(recipient2)

    const result = await sut.execute({
      recipientId: recipient1.id.toString(),
      name: 'example-name-updated',
      individualRegistration: '456.143.238.80',
      email: recipient2.email,
      cellphone: '+551195119-5312',
      adresses: [],
    })

    expect(result.value).toBeInstanceOf(UserWithSameEmailError)
  })
})
