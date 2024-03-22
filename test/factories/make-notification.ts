import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { PrismaNotificationsMapper } from '@/infra/database/mappers/notifications-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

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

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(override: Partial<NotificationProps> = {}) {
    const notification = makeNotification(override)
    const data = PrismaNotificationsMapper.toPrisma(notification)

    await this.prisma.notification.create({
      data,
    })

    return notification
  }
}
