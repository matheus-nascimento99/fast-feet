import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { DeleteRecipientUseCase } from './delete-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: DeleteRecipientUseCase

describe('Delete recipient use case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to delete a recipient', async () => {
    const recipientId = 'example-recipient-id'

    const recipient = makeRecipient({}, new UniqueEntityId(recipientId))

    inMemoryRecipientsRepository.create(recipient)

    await sut.execute({ recipientId })

    expect(inMemoryRecipientsRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a recipient with an inexistent recipient', async () => {
    const recipientId = 'example-recipient-id'
    const recipientInexistentId = 'example-recipient-id-inexistent'

    const recipient = makeRecipient({}, new UniqueEntityId(recipientId))

    inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({ recipientId: recipientInexistentId })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
