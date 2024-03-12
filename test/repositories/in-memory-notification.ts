import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async create(data: Notification) {
    this.items.push(data)
  }

  async findById(notificationId: UniqueEntityId) {
    const notification = this.items.find(
      (item) => item.id.toValue() === notificationId.toValue(),
    )

    if (!notification) {
      return null
    }

    return notification
  }

  async save(data: Notification) {
    const notificationIndex = this.items.findIndex(
      (item) => item.id === data.id,
    )

    this.items[notificationIndex] = data
  }
}
