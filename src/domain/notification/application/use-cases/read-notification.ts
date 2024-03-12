import { Either, left, right } from '@/core/either'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  { notification: Notification },
  BadRequestError | NotAuthorizedError
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(
      new UniqueEntityId(notificationId),
    )

    if (!notification) {
      return left(new BadRequestError('Notification not found.'))
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAuthorizedError('Not authorized.'))
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({
      notification,
    })
  }
}
