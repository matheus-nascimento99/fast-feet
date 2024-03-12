import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { FetchOrdersUseCase } from './fetch-orders'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchOrdersUseCase

describe('Fetch orders use case', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new FetchOrdersUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch orders', async () => {
    inMemoryOrdersRepository.create(makeOrder())
    inMemoryOrdersRepository.create(makeOrder())
    inMemoryOrdersRepository.create(makeOrder())

    const { value } = await sut.execute({ limit: 20, page: 1 })
    expect(value?.items).toHaveLength(3)
  })

  it('should be able to fetch orders paginated', async () => {
    for (let index = 1; index <= 22; index++) {
      inMemoryOrdersRepository.create(
        makeOrder({
          deliveryManId: new UniqueEntityId(`example-order-paginated-${index}`),
        }),
      )
    }

    const { value } = await sut.execute({ page: 2, limit: 20 })
    expect(value?.items).toHaveLength(2)
  })
})
