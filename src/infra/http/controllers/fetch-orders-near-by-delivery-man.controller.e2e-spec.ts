import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch orders near by delivery man (e2e)', () => {
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

  test('/:delivery_man_id/near (GET)', async () => {
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const token = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: 'DELIVERYMAN',
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    for (let index = 0; index < 11; index++) {
      await orderFactory.makePrismaOrder({
        deliveryManId: deliveryMan.id.toString(),
        recipientId: recipient.id.toString(),
        coordinates: {
          lat: index <= 9 ? -23.6514773 : faker.location.latitude(),
          lng: index <= 9 ? -46.7195083 : faker.location.longitude(),
        },
      })
    }

    const result = await request(app.getHttpServer())
      .get(
        `/orders/${deliveryMan.id.toString()}/near?latitude=-23.6632204&longitude=-46.7188515`,
      )
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body).toHaveLength(10)
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
        deliveryManId: deliveryMan.id.toString(),
        recipientId: recipient.id.toString(),
        coordinates: {
          lat: index <= 9 ? -23.6514773 : faker.location.latitude(),
          lng: index <= 9 ? -46.7195083 : faker.location.longitude(),
        },
      })
    }

    const result = await request(app.getHttpServer())
      .get(
        `/orders/${deliveryMan.id.toString()}/near?latitude=-23.6632204&longitude=-46.7188515&page=2&limit=8`,
      )
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body).toHaveLength(2)
  })
})
