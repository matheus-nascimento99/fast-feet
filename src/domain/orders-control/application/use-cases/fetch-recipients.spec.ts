import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryAdressesRepository } from 'test/repositories/in-memory-address'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { FetchRecipientsUseCase } from './fetch-recipients'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdressesRepository: InMemoryAdressesRepository
let sut: FetchRecipientsUseCase

describe('Fetch recipients use case', () => {
  beforeEach(() => {
    inMemoryAdressesRepository = new InMemoryAdressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryAdressesRepository,
    )
    sut = new FetchRecipientsUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to fetch recipients', async () => {
    inMemoryRecipientsRepository.create(makeRecipient())
    inMemoryRecipientsRepository.create(makeRecipient())
    inMemoryRecipientsRepository.create(makeRecipient())

    const { value } = await sut.execute({ limit: 20, page: 1 })
    expect(value?.items).toHaveLength(3)
  })

  it('should be able to fetch recipients paginated', async () => {
    for (let index = 1; index <= 22; index++) {
      inMemoryRecipientsRepository.create(
        makeRecipient({ name: `example-recipient-paginated-${index}` }),
      )
    }

    const { value } = await sut.execute({ page: 2, limit: 20 })
    expect(value?.items).toHaveLength(2)
  })
})
