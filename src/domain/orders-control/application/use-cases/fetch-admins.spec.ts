import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admin'

import { FetchAdminsUseCase } from './fetch-admins'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: FetchAdminsUseCase

describe('Fetch admins use case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new FetchAdminsUseCase(inMemoryAdminsRepository)
  })

  it('should be able to fetch admins', async () => {
    inMemoryAdminsRepository.create(await makeAdmin())
    inMemoryAdminsRepository.create(await makeAdmin())
    inMemoryAdminsRepository.create(await makeAdmin())

    const { value } = await sut.execute({ limit: 20, page: 1 })
    expect(value?.items).toHaveLength(3)
  })

  it('should be able to fetch admins paginated', async () => {
    for (let index = 1; index <= 22; index++) {
      inMemoryAdminsRepository.create(
        await makeAdmin({ name: `example-admin-paginated-${index}` }),
      )
    }

    const { value } = await sut.execute({ page: 2, limit: 20 })
    expect(value?.items).toHaveLength(2)
  })
})
