import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'
import { waitFor } from 'test/utils/wait-for'

import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('On order status  (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let orderFactory: OrderFactory
  let deliveryManFactory: DeliveryManFactory
  let recipientFactory: RecipientFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        OrderFactory,
        RecipientFactory,
        DeliveryManFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should be able to send notification when order status changes', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const token = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: 'DELIVERYMAN',
    })

    const order = await orderFactory.makePrismaOrder({
      deliveryManId: deliveryMan.id,
      recipientId: recipient.id,
    })

    await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/change-status/retired`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    const recipientId = recipient.id.toString()

    await waitFor(async () => {
      const notification = await prisma.notification.findFirst({
        where: {
          recipientId,
        },
      })

      expect(notification).not.toBeNull()
    })
  })
})
