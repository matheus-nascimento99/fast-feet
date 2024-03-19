import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { makeOrder } from 'test/factories/make-order'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { FetchOrdersUseCase } from './fetch-orders'

let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchOrdersUseCase

describe('Fetch orders use case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
      inMemoryDeliveryMenRepository,
    )
    sut = new FetchOrdersUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch orders', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)

    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryMenRepository.items.push(deliveryMan)

    inMemoryOrdersRepository.create(
      makeOrder({
        recipientId: recipient.id,
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        recipientId: recipient.id,
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        recipientId: recipient.id,
        deliveryManId: deliveryMan.id,
      }),
    )

    const { value } = await sut.execute({ limit: 20, page: 1 })
    expect(value?.items).toHaveLength(3)
    expect(value?.items).toEqual([
      expect.objectContaining({
        recipient: expect.objectContaining({ name: recipient.name }),
        deliveryMan: expect.objectContaining({ name: deliveryMan.name }),
      }),
      expect.objectContaining({
        recipient: expect.objectContaining({ name: recipient.name }),
        deliveryMan: expect.objectContaining({ name: deliveryMan.name }),
      }),
      expect.objectContaining({
        recipient: expect.objectContaining({ name: recipient.name }),
        deliveryMan: expect.objectContaining({ name: deliveryMan.name }),
      }),
    ])
  })

  it('should be able to fetch orders paginated', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)

    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryMenRepository.items.push(deliveryMan)

    for (let index = 1; index <= 22; index++) {
      inMemoryOrdersRepository.create(
        makeOrder({
          recipientId: recipient.id,
          deliveryManId: deliveryMan.id,
        }),
      )
    }

    const { value } = await sut.execute({ page: 2, limit: 20 })
    expect(value?.items).toHaveLength(2)
    expect(value?.items).toEqual([
      expect.objectContaining({
        recipient: expect.objectContaining({ name: recipient.name }),
        deliveryMan: expect.objectContaining({ name: deliveryMan.name }),
      }),
      expect.objectContaining({
        recipient: expect.objectContaining({ name: recipient.name }),
        deliveryMan: expect.objectContaining({ name: deliveryMan.name }),
      }),
    ])
  })
})
