import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { User, UserProps } from './user'

export type AdminProps = UserProps

export class Admin extends User<AdminProps> {
  static create(props: Optional<AdminProps, 'createdAt'>, id?: UniqueEntityId) {
    const admin = new Admin({ ...props, createdAt: new Date() }, id)

    return admin
  }
}
