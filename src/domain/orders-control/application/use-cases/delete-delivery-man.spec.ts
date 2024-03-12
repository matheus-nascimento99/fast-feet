import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { DeleteDeliveryManUseCase } from './delete-delivery-man'

let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let sut: DeleteDeliveryManUseCase

describe('Delete delivery man use case', () => {
  beforeEach(() => {
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new DeleteDeliveryManUseCase(inMemoryDeliveryMenRepository)
  })

  it('should be able to delete a delivery man', async () => {
    const deliveryManId = 'example-delivery-man-id'

    const deliveryMan = await makeDeliveryMan(
      {},
      new UniqueEntityId(deliveryManId),
    )

    inMemoryDeliveryMenRepository.create(deliveryMan)

    await sut.execute({ deliveryManId })

    expect(inMemoryDeliveryMenRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a delivery man with an inexistent delivery man', async () => {
    const deliveryManId = 'example-delivery-man-id'
    const deliveryManInexistentId = 'example-delivery-man-id-inexistent'

    const deliveryMan = await makeDeliveryMan(
      {},
      new UniqueEntityId(deliveryManId),
    )

    inMemoryDeliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({ deliveryManId: deliveryManInexistentId })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
