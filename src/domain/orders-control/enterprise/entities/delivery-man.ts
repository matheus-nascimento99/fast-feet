import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { User, UserProps } from './user'

export type DeliveryManProps = UserProps

export class DeliveryMan extends User<DeliveryManProps> {
  static create(
    props: Optional<DeliveryManProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const deliveryMan = new DeliveryMan({ ...props, createdAt: new Date() }, id)

    return deliveryMan
  }
}
