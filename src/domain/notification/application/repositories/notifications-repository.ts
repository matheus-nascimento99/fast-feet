import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Notification } from '../../enterprise/entities/notification'

export interface NotificationsRepository {
  findById(notificationId: UniqueEntityId): Promise<Notification | null>
  create(data: Notification): Promise<void>
  save(data: Notification): Promise<void>
}
