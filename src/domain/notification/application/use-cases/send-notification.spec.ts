import { faker } from '@faker-js/faker'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification'

import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send notification use case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      content: faker.lorem.sentence(10),
      recipientId: faker.string.uuid(),
      title: faker.lorem.sentence(5),
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryNotificationsRepository.items).toHaveLength(1)
  })
})
