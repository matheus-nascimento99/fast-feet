import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch orders by delivery man (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let deliveryManFactory: DeliveryManFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('/:delivery_man_id/delivery-man (GET)', async () => {
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const token = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: 'DELIVERYMAN',
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    for (let index = 0; index < 11; index++) {
      await orderFactory.makePrismaOrder({
        deliveryManId: deliveryMan.id,
        recipientId: recipient.id,
      })
    }

    const result = await request(app.getHttpServer())
      .get(`/orders/${deliveryMan.id.toString()}/delivery-man`)
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body).toHaveLength(11)
  })

  test('/ (GET) [paginated]', async () => {
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const token = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: 'DELIVERYMAN',
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    for (let index = 0; index < 11; index++) {
      await orderFactory.makePrismaOrder({
        deliveryManId: deliveryMan.id,
        recipientId: recipient.id,
      })
    }

    const result = await request(app.getHttpServer())
      .get(`/orders/${deliveryMan.id.toString()}/delivery-man?page=2&limit=9`)
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body).toHaveLength(2)
  })
})
