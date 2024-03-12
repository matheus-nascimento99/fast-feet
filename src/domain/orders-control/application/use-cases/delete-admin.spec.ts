import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admin'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { DeleteAdminUseCase } from './delete-admin'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: DeleteAdminUseCase

describe('Delete delivery man use case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new DeleteAdminUseCase(inMemoryAdminsRepository)
  })

  it('should be able to delete a delivery man', async () => {
    const adminId = 'example-admin-id'

    const admin = await makeAdmin({}, new UniqueEntityId(adminId))

    inMemoryAdminsRepository.create(admin)

    await sut.execute({ adminId })

    expect(inMemoryAdminsRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a delivery man with an inexistent delivery man', async () => {
    const adminId = 'example-admin-id'
    const adminInexistentId = 'example-admin-id-inexistent'

    const admin = await makeAdmin({}, new UniqueEntityId(adminId))

    inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({ adminId: adminInexistentId })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
