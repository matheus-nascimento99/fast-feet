import { randomUUID } from 'crypto'
import { makeAddress } from 'test/factories/make-address'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryAdressesRepository } from 'test/repositories/in-memory-address'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { AddressList } from '../../enterprise/entities/address-list'
import { DeleteRecipientUseCase } from './delete-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdressesRepository: InMemoryAdressesRepository
let sut: DeleteRecipientUseCase

describe('Delete recipient use case', () => {
  beforeEach(() => {
    inMemoryAdressesRepository = new InMemoryAdressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryAdressesRepository,
    )
    sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to delete a recipient', async () => {
    const recipientId = new UniqueEntityId()

    const adresses = Array.from({ length: 2 }).map(() => {
      const address = makeAddress({ recipientId })
      inMemoryAdressesRepository.create(address)

      return address
    })

    const recipient = makeRecipient(
      { adresses: new AddressList(adresses) },
      recipientId,
    )

    inMemoryRecipientsRepository.create(recipient)

    await sut.execute({ recipientId: recipient.id.toString() })

    expect(inMemoryRecipientsRepository.items).toHaveLength(0)
    expect(inMemoryAdressesRepository.items).toHaveLength(0)
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
