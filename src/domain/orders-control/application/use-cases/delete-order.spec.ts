import { makeOrder } from 'test/factories/make-order'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { DeleteOrderUseCase } from './delete-order'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: DeleteOrderUseCase

describe('Delete order use case', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
      inMemoryDeliveryMenRepository,
    )
    sut = new DeleteOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to delete a order', async () => {
    const orderId = 'example-order-id'

    const order = makeOrder({}, new UniqueEntityId(orderId))

    inMemoryOrdersRepository.create(order)

    await sut.execute({ orderId })

    expect(inMemoryOrdersRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a order with an inexistent order', async () => {
    const orderId = 'example-order-id'
    const orderInexistentId = 'example-order-id-inexistent'

    const order = makeOrder({}, new UniqueEntityId(orderId))

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({ orderId: orderInexistentId })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
