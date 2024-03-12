import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { RecipientsRepository } from '@/domain/orders-control/application/repositories/recipient'
import { OrderStatusAlteredEvent } from '@/domain/orders-control/enterprise/events/order-status-altered-event'

import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderStatusAltered implements EventHandler {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderStatusAlteredNotification.bind(this),
      OrderStatusAlteredEvent.name,
    )
  }

  private async sendOrderStatusAlteredNotification({
    order,
    status,
  }: OrderStatusAlteredEvent) {
    const recipient = await this.recipientsRepository.findById(
      order.recipientId.toString(),
    )

    if (recipient) {
      await this.sendNotificationUseCase.execute({
        recipientId: recipient.id.toString(),
        title: 'Order status changed',
        content: `Your order status changed to ${status}`,
      })
    }
  }
}
