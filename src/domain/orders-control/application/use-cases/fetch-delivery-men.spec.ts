import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-delivery-man'

import { FetchDeliveryMenUseCase } from './fetch-delivery-men'

let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository
let sut: FetchDeliveryMenUseCase

describe('Fetch delivery men use case', () => {
  beforeEach(() => {
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new FetchDeliveryMenUseCase(inMemoryDeliveryMenRepository)
  })

  it('should be able to fetch delivery men', async () => {
    inMemoryDeliveryMenRepository.create(await makeDeliveryMan())
    inMemoryDeliveryMenRepository.create(await makeDeliveryMan())
    inMemoryDeliveryMenRepository.create(await makeDeliveryMan())

    const { value } = await sut.execute({ limit: 20, page: 1 })
    expect(value?.items).toHaveLength(3)
  })

  it('should be able to fetch delivery men paginated', async () => {
    for (let index = 1; index <= 22; index++) {
      inMemoryDeliveryMenRepository.create(
        await makeDeliveryMan({
          name: `example-delivery-man-paginated-${index}`,
        }),
      )
    }

    const { value } = await sut.execute({ page: 2, limit: 20 })
    expect(value?.items).toHaveLength(2)
  })
})
