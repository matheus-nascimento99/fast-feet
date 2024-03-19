import { LatLng } from '@/core/types/coordinates'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { ValueObject } from '@/core/value-objects/value-object'

import { Attachment } from '../attachment'
import { OrderStatusProps } from '../order'

export type OrderWithDetailsType = {
  orderId: UniqueEntityId
  recipient: {
    id: UniqueEntityId
    name: string
  }
  deliveryMan: {
    id: UniqueEntityId
    name: string
  }
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

export class OrderWithDetails extends ValueObject<OrderWithDetailsType> {
  get orderId() {
    return this.props.orderId
  }

  get recipient() {
    return this.props.recipient
  }

  get deliveryMan() {
    return this.props.deliveryMan
  }

  get coordinates() {
    return this.props.coordinates
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get attachment() {
    return this.props.attachment
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

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: OrderWithDetailsType) {
    return new OrderWithDetails(props)
  }
}
