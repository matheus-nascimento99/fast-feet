import { randomUUID } from 'node:crypto'

export class UniqueEntityId {
  private value

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  equals(id: UniqueEntityId) {
    return this.toValue() === id.toValue()
  }
}
