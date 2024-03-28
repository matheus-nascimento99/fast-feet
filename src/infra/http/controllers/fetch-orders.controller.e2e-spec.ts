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

describe('Fetch orders (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let deliveryManFactory: DeliveryManFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        DeliveryManFactory,
        RecipientFactory,
        OrderFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('/ (GET)', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const token = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()
    const recipient = await recipientFactory.makePrismaRecipient()

    for (let index = 0; index < 10; index++) {
      await orderFactory.makePrismaOrder({
        deliveryManId: deliveryMan.id,
        recipientId: recipient.id,
      })
    }

    const result = await request(app.getHttpServer())
      .get(`/orders`)
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body).toHaveLength(10)
    expect(result.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          recipient: expect.objectContaining({ name: recipient.name }),
          deliveryMan: expect.objectContaining({ name: deliveryMan.name }),
        }),
      ]),
    )
  })

  test('/ (GET) [paginated]', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const token = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const result = await request(app.getHttpServer())
      .get(`/orders?page=2&limit=8`)
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body).toHaveLength(2)
  })
})
