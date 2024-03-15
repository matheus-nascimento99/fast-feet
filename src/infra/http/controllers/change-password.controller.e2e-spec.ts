import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

import { HashComparer } from '@/domain/orders-control/application/hash/hash-comparer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { HashModule } from '@/infra/hash/hash.module'

describe('Change password (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let deliveryManFactory: DeliveryManFactory
  let prisma: PrismaService
  let hashComparer: HashComparer

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, HashModule],
      providers: [AdminFactory, DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    hashComparer = moduleRef.get(HashComparer)

    await app.init()
  })

  it('/:user_id/change-password [ADMIN] (PATCH)', async () => {
    const password = '1234'
    const newPassword = '12345'

    const admin = await adminFactory.makePrismaAdmin({ password })

    const token = jwt.sign({
      sub: admin.id.toString(),
      role: 'ADMIN',
    })

    const result = await request(app.getHttpServer())
      .patch(`/users/${admin.id.toString()}/change-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        newPassword,
      })

    const userEdited = await prisma.user.findUnique({
      where: {
        id: admin.id.toString(),
      },
    })

    if (!userEdited) {
      throw new Error('User not created')
    }

    const isUserPasswordEditedEqualsNewPassword = await hashComparer.compare(
      newPassword,
      userEdited.password,
    )

    expect(result.statusCode).toEqual(204)
    expect(isUserPasswordEditedEqualsNewPassword).toEqual(true)
  })

  it('/:user_id/change-password [DELIVERY MAN] (PATCH)', async () => {
    const password = '1234'
    const newPassword = '12345'

    const admin = await adminFactory.makePrismaAdmin()

    const token = jwt.sign({
      sub: admin.id.toString(),
      role: 'ADMIN',
    })

    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan({
      password,
    })

    const result = await request(app.getHttpServer())
      .patch(`/users/${deliveryMan.id.toString()}/change-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        newPassword,
      })

    const userEdited = await prisma.user.findUnique({
      where: {
        id: deliveryMan.id.toString(),
      },
    })

    if (!userEdited) {
      throw new Error('User not created')
    }

    const isUserPasswordEditedEqualsNewPassword = await hashComparer.compare(
      newPassword,
      userEdited.password,
    )

    expect(result.statusCode).toEqual(204)
    expect(isUserPasswordEditedEqualsNewPassword).toEqual(true)
  })
})
