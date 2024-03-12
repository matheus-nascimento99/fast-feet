import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  public _domainEvents: DomainEvent[] = []

  get domainEvents() {
    return this._domainEvents
  }

  protected addEventDomain(event: DomainEvent) {
    this._domainEvents.push(event)
    DomainEvents.markAggregateForDispatch(this)
  }

  clearEvents() {
    this._domainEvents = []
  }
}
