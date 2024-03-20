import { makeAdmin } from 'test/factories/make-admin'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admin'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FetchOrdersByDeliveryManUseCase } from './fetch-orders-by-delivery-man'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let sut: FetchOrdersByDeliveryManUseCase

describe('Fetch orders use case by delivery man', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
      inMemoryDeliveryMenRepository,
    )
    sut = new FetchOrdersByDeliveryManUseCase(
      inMemoryAdminsRepository,
      inMemoryOrdersRepository,
      inMemoryDeliveryMenRepository,
    )
  })

  it('should be able to fetch orders by delivery man', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(makeOrder())

    const result = await sut.execute({
      limit: 20,
      page: 1,
      deliveryManId: deliveryMan.id.toString(),
      userId: deliveryMan.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).not.toBeInstanceOf(ResourceNotFoundError)
    expect(result.value).toEqual({
      items: expect.arrayContaining([expect.any(Object)]),
    })
  })

  it('should be able to fetch orders by delivery man using an admin login', async () => {
    const admin = await makeAdmin()
    inMemoryAdminsRepository.create(admin)

    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(makeOrder())

    const result = await sut.execute({
      limit: 20,
      page: 1,
      deliveryManId: deliveryMan.id.toString(),
      userId: admin.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).not.toBeInstanceOf(ResourceNotFoundError)
    expect(result.value).toEqual({
      items: expect.arrayContaining([expect.any(Object)]),
    })
  })

  it('should not be able to fetch orders by an inexistent delivery man', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(makeOrder())

    const result = await sut.execute({
      limit: 20,
      page: 1,
      deliveryManId: '123',
      userId: deliveryMan.id.toString(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to fetch orders by an inexistent user id', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(makeOrder())

    const result = await sut.execute({
      limit: 20,
      page: 1,
      deliveryManId: deliveryMan.id.toString(),
      userId: 'inexistent-user-id',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to fetch orders of another delivery man not using an admin login', async () => {
    const primaryDeliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(primaryDeliveryMan)

    const secondDeliveryMan = await makeDeliveryMan()
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
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })

  it('should be able to fetch orders by delivery man paginated', async () => {
    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )

    const result = await sut.execute({
      limit: 2,
      page: 2,
      deliveryManId: deliveryMan.id.toString(),
      userId: deliveryMan.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).not.toBeInstanceOf(ResourceNotFoundError)
    expect(result.value).toEqual({
      items: expect.arrayContaining([expect.any(Object)]),
    })
  })

  it('should be able to fetch orders by delivery man paginated using an admin login', async () => {
    const admin = await makeAdmin()
    inMemoryAdminsRepository.create(admin)

    const deliveryMan = await makeDeliveryMan()
    inMemoryDeliveryMenRepository.create(deliveryMan)

    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )
    inMemoryOrdersRepository.create(
      makeOrder({
        deliveryManId: deliveryMan.id,
      }),
    )

    const result = await sut.execute({
      limit: 2,
      page: 2,
      deliveryManId: deliveryMan.id.toString(),
      userId: admin.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).not.toBeInstanceOf(ResourceNotFoundError)
    expect(result.value).toEqual({
      items: expect.arrayContaining([expect.any(Object)]),
    })
  })
})
