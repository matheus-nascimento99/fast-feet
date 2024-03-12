import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseResponse = Either<
  { notification: Notification },
  null
>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute(
    data: SendNotificationUseCaseRequest,
  ): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      ...data,
      recipientId: new UniqueEntityId(data.recipientId),
    })

    await this.notificationsRepository.create(notification)

    return right({
      notification,
    })
  }
}
