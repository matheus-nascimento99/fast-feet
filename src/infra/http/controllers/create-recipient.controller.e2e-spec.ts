import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address'
import { AdminFactory } from 'test/factories/make-admin'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create recipient (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let addressFactory: AddressFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, AddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    addressFactory = moduleRef.get(AddressFactory)

    await app.init()
  })

  test('/ (POST)', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const token = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const address1 = await addressFactory.makePrismaAddress()
    const address2 = await addressFactory.makePrismaAddress()

    const createRecipient = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        individualRegistration: faker.number.int().toString(),
        cellphone: faker.phone.number(),
        password: faker.internet.password(),
        adresses: [address1.id.toString(), address2.id.toString()],
      })

    const adresses = await prisma.address.findMany({
      where: {
        recipientId: createRecipient.body.id,
      },
    })

    expect(createRecipient.statusCode).toEqual(201)
    expect(adresses).toHaveLength(2)
  })
})
