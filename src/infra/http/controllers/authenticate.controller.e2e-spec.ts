import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { DEFAULT_PASSWORD } from 'test/utils/default-password'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Authenticate (e2e)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let deliveryManFactory: DeliveryManFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  test('/ (POST) [ADMIN]', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const authenticateAdmin = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        individualRegistration: admin.individualRegistration.value,
        password: DEFAULT_PASSWORD,
      })

    expect(authenticateAdmin.statusCode).toEqual(201)
    expect(authenticateAdmin.body).toMatchObject({
      access_token: expect.any(String),
    })
  })

  test('/ (POST) [DELIVERY MAN]', async () => {
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const authenticateDeliveryMan = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        individualRegistration: deliveryMan.individualRegistration.value,
        password: DEFAULT_PASSWORD,
      })

    expect(authenticateDeliveryMan.statusCode).toEqual(201)
    expect(authenticateDeliveryMan.body).toMatchObject({
      access_token: expect.any(String),
    })
  })
})
