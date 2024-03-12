import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { EditDeliveryManUseCase } from './edit-delivery-man'

let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let sut: EditDeliveryManUseCase

describe('Edit delivery man use case', () => {
  beforeEach(() => {
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new EditDeliveryManUseCase(inMemoryDeliveryMenRepository)
  })

  it('should be able to edit a delivery man', async () => {
    const deliveryManId = 'example-delivery-man-id'

    const deliveryMan = await makeDeliveryMan(
      {},
      new UniqueEntityId(deliveryManId),
    )

    inMemoryDeliveryMenRepository.create(deliveryMan)

    await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      name: 'example-name-updated',
      individualRegistration: '123.456.789-10',
      email: 'example-email-updated@mail.com',
      cellphone: '+551198425-1086',
    })

    expect(inMemoryDeliveryMenRepository.items[0]).toMatchObject({
      name: 'example-name-updated',
    })
  })

  it('should be not able to edit a delivery man with an inexistent delivery man', async () => {
    const deliveryManId = 'example-delivery-man-id'
    const deliveryManInexistentId = 'example-delivery-man-id-inexistent'

    const deliveryMan = await makeDeliveryMan(
      {},
      new UniqueEntityId(deliveryManId),
    )

    inMemoryDeliveryMenRepository.create(deliveryMan)

    const result = await sut.execute({
      deliveryManId: deliveryManInexistentId,
      name: 'example-name-updated',
      individualRegistration: '123.456.789-10',
      email: 'example-email-updated@mail.com',
      cellphone: '+551198425-1086',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
