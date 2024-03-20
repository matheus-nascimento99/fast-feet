import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationsRepository {
  abstract findById(
    notificationId: UniqueEntityId,
  ): Promise<Notification | null>

  abstract create(data: Notification): Promise<void>
  abstract save(
    notificationId: UniqueEntityId,
    data: Notification,
  ): Promise<void>
}
