import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { makeOrder, OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import { OrdersRepository } from '@/domain/orders-control/application/repositories/order'
import { AppModule } from '@/infra/app.module'
import { CacheModule } from '@/infra/cache/cache.module'
import { Cacher } from '@/infra/cache/cacher'

import { DatabaseModule } from '../../database.module'

describe('Prisma orders repository', () => {
  let app: INestApplication
  let orderFactory: OrderFactory
  let deliveryManFactory: DeliveryManFactory
  let recipientFactory: RecipientFactory
  let ordersRepository: OrdersRepository
  let cache: Cacher

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [OrderFactory, RecipientFactory, DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    orderFactory = moduleRef.get(OrderFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    ordersRepository = moduleRef.get(OrdersRepository)
    cache = moduleRef.get(Cacher)

    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  it('should be able to cache orders when fetch it', async () => {
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()
    const recipient = await recipientFactory.makePrismaRecipient()

    await orderFactory.makePrismaOrder({
      deliveryManId: deliveryMan.id,
      recipientId: recipient.id,
    })

    await ordersRepository.findMany({ limit: 20, page: 1 })

    const ordersCacheHit = await cache.get('fast-feet:orders')

    expect(ordersCacheHit).not.toBeNull()
  })

  it('should be able to clear cache when a new order be created', async () => {
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()
    const recipient = await recipientFactory.makePrismaRecipient()

    const order = makeOrder({
      deliveryManId: deliveryMan.id,
      recipientId: recipient.id,
    })

    await ordersRepository.create(order)

    const ordersCacheHit = await cache.get('fast-feet:orders')

    expect(ordersCacheHit).toBeNull()
  })
})
