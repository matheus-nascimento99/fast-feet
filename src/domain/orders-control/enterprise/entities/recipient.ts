import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { AddressList } from './address-list'
import { User, UserProps } from './user'

export type RecipientProps = UserProps

export class Recipient extends User<RecipientProps> {
  static create(
    props: Optional<RecipientProps, 'createdAt' | 'adresses'>,
    id?: UniqueEntityId,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        adresses: props.adresses ?? new AddressList(),
        createdAt: new Date(),
      },
      id,
    )

    return recipient
  }
}
