import { faker } from '@faker-js/faker'
import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification'

import { BadRequestError } from '@/core/errors/bad-request-error'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'

import { ReadNotificationUseCase } from './read-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read notification use case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()
    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to read an inexistent notification', async () => {
    const notification = makeNotification()
    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: faker.string.uuid(),
      recipientId: notification.recipientId.toString(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(BadRequestError)
  })

  it('should not be able to read a notification from other user', async () => {
    const notification = makeNotification()
    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: faker.string.uuid(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })
})
