import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'

import { CreateRecipientUseCase } from './create-recipient'

let sut: CreateRecipientUseCase
let recipientRepository: InMemoryRecipientsRepository

describe('Create recipient use case', () => {
  beforeEach(() => {
    recipientRepository = new InMemoryRecipientsRepository()
    sut = new CreateRecipientUseCase(recipientRepository)
  })

  it('should be able to create a recipient', async () => {
    const { value } = await sut.execute({
      name: 'Matheus',
      individualRegistration: '456.143.238-80',
      cellphone: '+551195119-5312',
      email: 'mnsergio59@gmail.com',
      postalCode: '12955-000',
      street: 'Rua Marinha Gonçalves da Costa',
      streetNumber: 70,
      complement: 'Casa B',
      neighborhood: 'Centro',
      city: 'Bom Jesus dos Perdões',
      state: 'SP',
    })

    expect(value?.item).toEqual(
      expect.objectContaining({ name: expect.any(String) }),
    )
  })
})
