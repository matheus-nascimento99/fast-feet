import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'

export interface RecipientProps {
  name: string
  individualRegistration: Mask
  cellphone: Mask
  email: string
  postalCode: Mask
  street: string
  streetNumber: number
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Recipient extends Entity<RecipientProps> {
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

  get cellphone() {
    return this.props.cellphone
  }

  set cellphone(value: Mask) {
    this.props.cellphone = value
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(value: string) {
    this.props.email = value
    this.touch()
  }

  get postalCode() {
    return this.props.postalCode
  }

  set postalCode(value: Mask) {
    this.props.postalCode = value
    this.touch()
  }

  get street() {
    return this.props.street
  }

  set street(value: string) {
    this.props.street = value
    this.touch()
  }

  get streetNumber() {
    return this.props.streetNumber
  }

  set streetNumber(value: number) {
    this.props.streetNumber = value
    this.touch()
  }

  get complement() {
    return this.props.complement
  }

  set complement(value: string | null | undefined) {
    this.props.complement = value
    this.touch()
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  set neighborhood(value: string) {
    this.props.neighborhood = value
    this.touch()
  }

  get city() {
    return this.props.city
  }

  set city(value: string) {
    this.props.city = value
    this.touch()
  }

  get state() {
    return this.props.state
  }

  set state(value: string) {
    this.props.state = value
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

  static create(
    props: Optional<RecipientProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const recipient = new Recipient({ ...props, createdAt: new Date() }, id)

    return recipient
  }
}
