import { faker } from '@faker-js/faker'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order'

import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FetchOrdersNearByDeliveryManUseCase } from './fetch-orders-near-by-delivery-man'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let sut: FetchOrdersNearByDeliveryManUseCase

describe('Fetch orders use case near by delivery man', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new FetchOrdersNearByDeliveryManUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryMenRepository,
    )
  })

  it('should be able to fetch orders near by delivery man', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const deliveryManCoordinates = { lat: -23.1374848, lng: -46.4683008 }

    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
        coordinates: { lat: -23.1333805, lng: -46.4701032 },
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
        coordinates: { lat: -23.1356007, lng: -46.4713469 },
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
        coordinates: { lat: -23.1230514, lng: -46.6000214 },
      }),
    )

    const result = await sut.execute({
      limit: 20,
      page: 1,
      deliveryManId: deliveryMan.id.toString(),
      userId: deliveryMan.id.toString(),
      coordinates: deliveryManCoordinates,
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toHaveProperty(
      'items',
      expect.arrayContaining([expect.any(Object)]),
    )
  })

  it('should not be able to fetch orders near by an inexistent delivery man', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const deliveryManCoordinates = { lat: -23.1374848, lng: -46.4683008 }

    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
        coordinates: { lat: -23.1333805, lng: -46.4701032 },
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
        coordinates: { lat: -23.1356007, lng: -46.4713469 },
      }),
    )

    const result = await sut.execute({
      limit: 20,
      page: 1,
      deliveryManId: '123',
      userId: deliveryMan.id.toString(),
      coordinates: deliveryManCoordinates,
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).instanceOf(ResourceNotFoundError)
  })

  it('should not be able to fetch orders near by of another delivery man', async () => {
    const primaryDeliveryMan = makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(primaryDeliveryMan)

    const secondDeliveryMan = makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(secondDeliveryMan)

    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: primaryDeliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: primaryDeliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(makeOrder())

    const result = await sut.execute({
      limit: 20,
      page: 1,
      deliveryManId: primaryDeliveryMan.id.toString(),
      userId: secondDeliveryMan.id.toString(),
      coordinates: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      },
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })

  it('should be able to fetch orders near by delivery man paginated', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    const deliveryManCoordinates = { lat: -23.1374848, lng: -46.4683008 }

    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
        coordinates: { lat: -23.1333805, lng: -46.4701032 },
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
        coordinates: { lat: -23.1356007, lng: -46.4713469 },
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
        coordinates: { lat: -23.1230514, lng: -46.6000214 },
      }),
    )

    const result = await sut.execute({
      limit: 1,
      page: 2,
      deliveryManId: deliveryMan.id.toString(),
      userId: deliveryMan.id.toString(),
      coordinates: deliveryManCoordinates,
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toHaveProperty(
      'items',
      expect.arrayContaining([expect.any(Object)]),
    )
  })
})
