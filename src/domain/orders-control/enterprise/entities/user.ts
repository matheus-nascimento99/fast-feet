import { AggregateRoot } from '@/core/entities/aggregate-root'

import { AddressList } from './address-list'
import { Mask } from './value-objects/mask'

export interface UserProps {
  email: string
  password: string
  name: string
  individualRegistration: Mask
  cellphone: Mask
  adresses: AddressList
  createdAt: Date
  updatedAt?: Date | null
}

export abstract class User<
  Props extends UserProps,
> extends AggregateRoot<Props> {
  get name() {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
    this.touch()
  }

  get individualRegistration() {
    return this.props.individualRegistration
  }

  set individualRegistration(value: Mask) {
    this.props.individualRegistration = value
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(value: string) {
    this.props.email = value
    this.touch()
  }

  get password() {
    return this.props.password
  }

  set password(value: string) {
    this.props.password = value
    this.touch()
  }

  get cellphone() {
    return this.props.cellphone
  }

  set cellphone(value: Mask) {
    this.props.cellphone = value
    this.touch()
  }

  get adresses() {
    return this.props.adresses
  }

  set adresses(value: AddressList) {
    this.props.adresses = value
    this.touch()
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

  private touch() {
    this.props.updatedAt = new Date()
  }
}
