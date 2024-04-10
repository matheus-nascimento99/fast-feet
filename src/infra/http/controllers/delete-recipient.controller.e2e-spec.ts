import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Delete recipient (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let addressFactory: AddressFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, AddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    addressFactory = moduleRef.get(AddressFactory)

    await app.init()
  })

  test('/:order_id (DELETE)', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const token = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const recipient = await recipientFactory.makePrismaRecipient()

    await addressFactory.makePrismaAddress({
      recipientId: recipient.id,
    })

    await addressFactory.makePrismaAddress({
      recipientId: recipient.id,
    })

    const result = await request(app.getHttpServer())
      .delete(`/recipients/${recipient.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)

    const recipientDeleted = await prisma.user.findUnique({
      where: {
        id: recipient.id.toString(),
      },
    })

    expect(result.statusCode).toEqual(204)
    expect(recipientDeleted).toBeNull()
  })
})
