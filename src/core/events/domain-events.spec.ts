import { AggregateRoot } from '../entities/aggregate-root'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  public aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  getAggregateId() {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addEventDomain(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen events', async () => {
    const callbackSpy = vi.fn()

    // Subscriber cadastrado (ouvindo o evento de "um novo agregado criado" por exemplo)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Criando um novo agregado porém SEM salvar no banco de dados
    const aggregate = CustomAggregate.create()

    // Assegurando que o evento foi criado porém NÃO foi disparado
    expect(aggregate._domainEvents).toHaveLength(1)

    // Salvando agregado no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // O subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate._domainEvents).toHaveLength(0)
  })
})
