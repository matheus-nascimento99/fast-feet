import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit order (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
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
    adminFactory = moduleRef.get(AdminFactory)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  test('/:order_id (PUT)', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const token = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const recipient = await recipientFactory.makePrismaRecipient()
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const order = await orderFactory.makePrismaOrder({
      deliveryManId: deliveryMan.id,
      recipientId: recipient.id,
    })

    const newRecipient = await recipientFactory.makePrismaRecipient()
    const newDeliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const newOrder = {
      deliveryManId: newDeliveryMan.id.toString(),
      recipientId: newRecipient.id.toString(),
      coordinates: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      },
    }

    const result = await request(app.getHttpServer())
      .put(`/orders/${order.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newOrder)

    const orderEdited = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      },
    })

    expect(result.statusCode).toEqual(204)
    expect(orderEdited).toBeTruthy()
    expect(orderEdited).toEqual(
      expect.objectContaining({ deliveryManId: newOrder?.deliveryManId }),
    )
  })
})
