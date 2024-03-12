import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { EditRecipientUseCase } from './edit-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: EditRecipientUseCase

describe('Edit recipient use case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new EditRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to edit a recipient', async () => {
    const recipientId = 'example-recipient-id'

    const recipient = makeRecipient({}, new UniqueEntityId(recipientId))

    inMemoryRecipientsRepository.create(recipient)

    await sut.execute({
      recipientId: recipient.id.toString(),
      name: 'example-name-updated',
      individualRegistration: '123.456.789-10',
      email: 'example-email-updated@mail.com',
      cellphone: '+551198425-1086',
      postalCode: '12955-000',
      street: 'example-street-updated',
      streetNumber: 2,
      complement: 'example-complement-updated',
      neighborhood: 'example-neighborhood-updated',
      city: 'example-city-updated',
      state: 'example-state-updated',
    })

    expect(inMemoryRecipientsRepository.items[0]).toMatchObject({
      name: 'example-name-updated',
    })
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
      postalCode: '12955-000',
      street: 'example-street-updated',
      streetNumber: 2,
      complement: 'example-complement-updated',
      neighborhood: 'example-neighborhood-updated',
      city: 'example-city-updated',
      state: 'example-state-updated',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
