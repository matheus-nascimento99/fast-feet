import { makeOrder } from 'test/factories/make-order'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipient'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnOrderStatusAltered } from './on-order-status-altered'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On order status altered', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnOrderStatusAltered(
      inMemoryRecipientsRepository,
      sendNotificationUseCase,
    )
  })

  it('should be able to send a notification when order status be altered', async () => {
    const recipient = makeRecipient()
    inMemoryRecipientsRepository.create(recipient)

    const order = makeOrder({ recipientId: recipient.id })
    inMemoryOrdersRepository.create(order)

    order.status = 'RETIRED'
    inMemoryOrdersRepository.save(order.id, order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
