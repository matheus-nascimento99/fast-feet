import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Mask } from './value-objects/mask'

export type AddressProps = {
  recipientId: UniqueEntityId
  postalCode: Mask
  street: string
  streetNumber: number
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  principal: boolean
}

export class Address extends Entity<AddressProps> {
  get recipientId() {
    return this.props.recipientId
  }

  set recipientId(value: UniqueEntityId) {
    this.props.recipientId = value
  }

  get postalCode() {
    return this.props.postalCode
  }

  set postalCode(value: Mask) {
    this.props.postalCode = value
  }

  get street() {
    return this.props.street
  }

  set street(value: string) {
    this.props.street = value
  }

  get streetNumber() {
    return this.props.streetNumber
  }

  set streetNumber(value: number) {
    this.props.streetNumber = value
  }

  get complement() {
    return this.props.complement
  }

  set complement(value: string | null | undefined) {
    this.props.complement = value
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  set neighborhood(value: string) {
    this.props.neighborhood = value
  }

  get city() {
    return this.props.city
  }

  set city(value: string) {
    this.props.city = value
  }

  get state() {
    return this.props.state
  }

  set state(value: string) {
    this.props.state = value
  }

  get principal() {
    return this.props.principal
  }

  set principal(value: boolean) {
    this.props.principal = value
  }

  static create(
    props: Optional<AddressProps, 'principal'>,
    id?: UniqueEntityId,
  ) {
    const address = new Address(
      { ...props, principal: props.principal ?? true },
      id,
    )

    return address
  }
}
