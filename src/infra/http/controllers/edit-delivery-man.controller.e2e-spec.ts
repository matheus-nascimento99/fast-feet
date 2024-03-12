import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit delivery man (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let deliveryManFactory: DeliveryManFactory
  let adminFactory: AdminFactory
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  it('/:id (PUT)', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const token = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const newDeliveryMan = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      individualRegistration: faker.number.int({ min: 11 }).toString(),
      cellphone: faker.phone.number(),
    }

    const result = await request(app.getHttpServer())
      .put(`/delivery-men/${deliveryMan.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newDeliveryMan)

    const deliveryManEdited = await prisma.user.findUnique({
      where: {
        id: deliveryMan.id.toString(),
      },
    })

    expect(result.statusCode).toEqual(204)
    expect(deliveryManEdited).toEqual(
      expect.objectContaining({ name: newDeliveryMan.name }),
    )
  })
})
