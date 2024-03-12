import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

export const makeNotification = (
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId,
) => {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(5),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id,
  )

  return notification
}
