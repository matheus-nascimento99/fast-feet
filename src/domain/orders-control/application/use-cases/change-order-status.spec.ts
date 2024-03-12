import { randomUUID } from 'crypto'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order'

import { BadRequestError } from '@/core/errors/bad-request-error'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Attachment } from '../../enterprise/entities/attachment'
import { ChangeOrderStatusUseCase } from './change-order-status'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let sut: ChangeOrderStatusUseCase

describe('Change status order use case', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new ChangeOrderStatusUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryMenRepository,
    )
  })

  it('should be able to change status order', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const orderId = 'example-order-id'

    const order = makeOrder(
      {
        deliveryManId: deliveryMan.id,
        attachment: Attachment.create({ link: randomUUID() }),
      },
      new UniqueEntityId(orderId),
    )

    inMemoryOrdersRepository.create(order)

    await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      orderId: order.id.toString(),
      status: 'DELIVERED',
    })

    expect(inMemoryOrdersRepository.items[0]).toMatchObject({
      status: 'DELIVERED',
    })
  })

  it('should be not able to change status order with an inexistent order', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const orderId = 'example-order-id'
    const orderInexistentId = 'example-order-id-inexistent'

    const order = makeOrder(
      { deliveryManId: deliveryMan.id },
      new UniqueEntityId(orderId),
    )

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      orderId: orderInexistentId,
      status: 'RETIRED',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be not able to change status order with an inexistent delivery man', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const orderId = 'example-order-id'
    const deliveryManInexistentId = 'example-order-id-inexistent'

    const order = makeOrder(
      { deliveryManId: deliveryMan.id },
      new UniqueEntityId(orderId),
    )

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      deliveryManId: deliveryManInexistentId,
      orderId,
      status: 'RETIRED',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be not able to change status order from another delivery man', async () => {
    const firstDeliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(firstDeliveryMan)

    const secondDeliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(secondDeliveryMan)

    const firstOrder = makeOrder({ deliveryManId: firstDeliveryMan.id })
    inMemoryOrdersRepository.create(firstOrder)

    const secondOrder = makeOrder({ deliveryManId: secondDeliveryMan.id })
    inMemoryOrdersRepository.create(secondOrder)

    const result = await sut.execute({
      deliveryManId: secondDeliveryMan.id.toString(),
      orderId: firstOrder.id.toString(),
      status: 'RETIRED',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })

  it('should be able to finish an order without attachment', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const orderId = 'example-order-id'

    const order = makeOrder(
      {
        deliveryManId: deliveryMan.id,
      },
      new UniqueEntityId(orderId),
    )

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      orderId: order.id.toString(),
      status: 'DELIVERED',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(BadRequestError)
  })
})
