import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { makeOrder } from 'test/factories/make-order'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { EditOrderUseCase } from './edit-order'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: EditOrderUseCase

describe('Edit order use case', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    sut = new EditOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryMenRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to edit a order', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const recipient = makeRecipient()
    inMemoryRecipientsRepository.create(recipient)

    const orderId = 'example-order-id'
    const order = makeOrder(
      { deliveryManId: deliveryMan.id, recipientId: recipient.id },
      new UniqueEntityId(orderId),
    )

    inMemoryOrdersRepository.create(order)

    await sut.execute({
      orderId: order.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
      recipientId: recipient.id.toString(),
      coordinates: {
        lat: 1,
        lng: 1,
      },
    })

    expect(inMemoryOrdersRepository.items[0]).toMatchObject({
      deliveryManId: deliveryMan.id,
      recipientId: recipient.id,
    })
  })

  it('should be not able to edit a order with an inexistent order', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const recipient = makeRecipient()
    inMemoryRecipientsRepository.create(recipient)

    const orderId = 'example-order-id'
    const orderInexistentId = 'example-order-id-inexistent'

    const order = makeOrder(
      { deliveryManId: deliveryMan.id, recipientId: recipient.id },
      new UniqueEntityId(orderId),
    )

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: orderInexistentId,
      deliveryManId: deliveryMan.id.toString(),
      recipientId: recipient.id.toString(),
      coordinates: {
        lat: 1,
        lng: 1,
      },
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be not able to edit a order with an inexistent delivery man', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const recipient = makeRecipient()
    inMemoryRecipientsRepository.create(recipient)

    const orderId = 'example-order-id'
    const deliveryManInexistentId = 'example-delivery-man-id-inexistent'

    const order = makeOrder(
      { deliveryManId: deliveryMan.id, recipientId: recipient.id },
      new UniqueEntityId(orderId),
    )

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryManId: deliveryManInexistentId,
      recipientId: recipient.id.toString(),
      coordinates: {
        lat: 1,
        lng: 1,
      },
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be not able to edit a order with an inexistent recipient', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const recipient = makeRecipient()
    inMemoryRecipientsRepository.create(recipient)

    const orderId = 'example-order-id'
    const recipientInexistentId = 'example-recipient-id-inexistent'

    const order = makeOrder(
      { deliveryManId: deliveryMan.id, recipientId: recipient.id },
      new UniqueEntityId(orderId),
    )

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryManId: deliveryMan.id.toString(),
      recipientId: recipientInexistentId,
      coordinates: {
        lat: 1,
        lng: 1,
      },
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
