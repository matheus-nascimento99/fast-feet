import { faker } from '@faker-js/faker'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryAdressesRepository } from 'test/repositories/in-memory-address'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { CreateOrderUseCase } from './create-order'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdressesRepository: InMemoryAdressesRepository
let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let sut: CreateOrderUseCase

describe('Create order use case', () => {
  beforeEach(() => {
    inMemoryAdressesRepository = new InMemoryAdressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryAdressesRepository,
    )
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
      inMemoryDeliveryMenRepository,
    )
    sut = new CreateOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryRecipientsRepository,
      inMemoryDeliveryMenRepository,
    )
  })

  it('should be able to create a order', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const recipient = makeRecipient()
    inMemoryRecipientsRepository.create(recipient)

    const { value } = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      recipientId: recipient.id.toString(),
      coordinates: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      },
    })

    expect(value).toEqual({
      item: expect.objectContaining({
        deliveryManId: expect.any(UniqueEntityId),
      }),
    })
  })

  it('should be not able to edit a order with an inexistent delivery man', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const recipient = makeRecipient()
    inMemoryRecipientsRepository.create(recipient)

    const deliveryManInexistentId = 'example-delivery-man-id-inexistent'

    const result = await sut.execute({
      deliveryManId: deliveryManInexistentId,
      recipientId: recipient.id.toString(),
      coordinates: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      },
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be not able to edit a order with an inexistent recipient', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const recipient = makeRecipient()
    inMemoryRecipientsRepository.create(recipient)

    const recipientInexistentId = 'example-recipient-id-inexistent'

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      recipientId: recipientInexistentId,
      coordinates: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      },
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
