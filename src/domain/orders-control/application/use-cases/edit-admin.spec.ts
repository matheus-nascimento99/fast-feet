import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admin'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { EditAdminUseCase } from './edit-admin'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: EditAdminUseCase

describe('Edit admin use case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new EditAdminUseCase(inMemoryAdminsRepository)
  })

  it('should be able to edit a admin', async () => {
    const adminId = 'example-admin-id'

    const admin = await makeAdmin({}, new UniqueEntityId(adminId))

    inMemoryAdminsRepository.create(admin)

    await sut.execute({
      adminId: admin.id.toString(),
      name: 'example-name-updated',
      individualRegistration: '123.456.789-10',
      email: 'example-email-updated@mail.com',
      cellphone: '+551198425-1086',
    })

    expect(inMemoryAdminsRepository.items[0]).toMatchObject({
      name: 'example-name-updated',
    })
  })

  it('should be not able to edit a admin with an inexistent admin', async () => {
    const adminId = 'example-admin-id'
    const adminInexistentId = 'example-admin-id-inexistent'

    const admin = await makeAdmin({}, new UniqueEntityId(adminId))

    inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      adminId: adminInexistentId,
      name: 'example-name-updated',
      individualRegistration: '123.456.789-10',
      email: 'example-email-updated@mail.com',
      cellphone: '+551198425-1086',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
