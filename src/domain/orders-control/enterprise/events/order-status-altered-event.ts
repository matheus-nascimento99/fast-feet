import { DomainEvent } from '@/core/events/domain-event'

import { Order, OrderStatusProps } from '../entities/order'

export class OrderStatusAlteredEvent implements DomainEvent {
  public ocurredAt: Date
  public order: Order
  public status: OrderStatusProps

  constructor(order: Order, status: OrderStatusProps) {
    this.order = order
    this.status = status
    this.ocurredAt = new Date()
  }

  getAggregateId() {
    return this.order.id
  }
}
