import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { AddressList } from './address-list'
import { User, UserProps } from './user'

export type AdminProps = UserProps

export class Admin extends User<AdminProps> {
  static create(
    props: Optional<AdminProps, 'createdAt' | 'adresses'>,
    id?: UniqueEntityId,
  ) {
    const admin = new Admin(
      {
        ...props,
        adresses: props.adresses ?? new AddressList(),
        createdAt: new Date(),
      },
      id,
    )

    return admin
  }
}
