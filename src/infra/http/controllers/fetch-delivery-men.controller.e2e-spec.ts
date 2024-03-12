import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch delivery men (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let deliveryManFactory: DeliveryManFactory

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  it('/ (GET)', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const token = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    await deliveryManFactory.makePrismaDeliveryMan({
      name: 'First Delivery Man',
    })
    await deliveryManFactory.makePrismaDeliveryMan({
      name: 'Second Delivery Man',
    })

    const result = await request(app.getHttpServer())
      .get('/delivery-men')
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'First Delivery Man' }),
        expect.objectContaining({ name: 'Second Delivery Man' }),
      ]),
    )
  })
})
