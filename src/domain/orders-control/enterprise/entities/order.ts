import { AggregateRoot } from '@/core/entities/aggregate-root'
import { LatLng } from '@/core/types/coordinates'
import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { OrderStatusAlteredEvent } from '../events/order-status-altered-event'
import { Attachment } from './attachment'

export type OrderStatusProps = 'WAITING' | 'RETIRED' | 'DELIVERED' | 'RETURNED'

export interface OrderProps {
  deliveryManId: UniqueEntityId
  recipientId: UniqueEntityId
  coordinates: LatLng
  status: OrderStatusProps
  createdAt: Date
  attachment?: Attachment | null
  postedAt?: Date | null
  retiredAt?: Date | null
  deliveredAt?: Date | null
  returnedAt?: Date | null
  updatedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get deliveryManId() {
    return this.props.deliveryManId
  }

  set deliveryManId(value: UniqueEntityId) {
    this.props.deliveryManId = value
    this.touch()
  }

  get recipientId() {
    return this.props.recipientId
  }

  set recipientId(value: UniqueEntityId) {
    this.props.recipientId = value
    this.touch()
  }

  get coordinates() {
    return this.props.coordinates
  }

  set coordinates(value: LatLng) {
    this.props.coordinates = value
  }

  get status() {
    return this.props.status
  }

  set status(value: OrderStatusProps) {
    if (this.props.status !== value) {
      this.addEventDomain(new OrderStatusAlteredEvent(this, value))
    }

    if (value === 'RETIRED') {
      this.retire()
    }

    if (value === 'DELIVERED') {
      this.deliver()
    }

    if (value === 'RETURNED') {
      this.return()
    }

    this.props.status = value
    this.touch()
  }

  get attachment() {
    return this.props.attachment
  }

  set attachment(value: Attachment | null | undefined) {
    this.props.attachment = value
  }

  get createdAt() {
    return this.props.createdAt
  }

  set createdAt(value: Date) {
    this.props.createdAt = value
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get postedAt() {
    return this.props.postedAt
  }

  get retiredAt() {
    return this.props.retiredAt
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  get returnedAt() {
    return this.props.returnedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  private retire() {
    this.props.retiredAt = new Date()
  }

  private deliver() {
    this.props.deliveredAt = new Date()
  }

  private return() {
    this.props.returnedAt = new Date()
  }

  static create(
    props: Optional<
      OrderProps,
      'status' | 'createdAt' | 'postedAt' | 'retiredAt'
    >,
    id?: UniqueEntityId,
  ) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? 'WAITING',
        createdAt: props.createdAt ?? new Date(),
        postedAt: props.postedAt ?? new Date(),
      },
      id,
    )

    return order
  }
}
