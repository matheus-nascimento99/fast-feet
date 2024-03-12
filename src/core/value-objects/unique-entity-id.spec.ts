import { UniqueEntityId } from './unique-entity-id'

describe('Unique entity id generator', () => {
  it('should be able to generate a new unique entity id', () => {
    const entityId = new UniqueEntityId()

    expect(entityId).toBeInstanceOf(UniqueEntityId)
  })

  it('should be able to generate a new instance of unique entity id', () => {
    const id = '123'
    const entityId = new UniqueEntityId(id)

    expect(entityId).toBeInstanceOf(UniqueEntityId)
    expect(entityId.toValue()).toEqual(id)
    expect(entityId.toString()).toEqual(id)
  })
})
