import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create address (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let recipientFactory: RecipientFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('/adresses [POST]', async () => {
    const user = await recipientFactory.makePrismaRecipient()
    const token = jwt.sign({ sub: user.id.toString(), role: 'RECIPIENT' })

    const result = await request(app.getHttpServer())
      .post('/adresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        postalCode: faker.location.zipCode(),
        street: faker.location.streetAddress(),
        streetNumber: faker.number.int(1000),
        complement: faker.lorem.sentence(10),
        neighborhood: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state(),
      })

    const address = await prisma.address.findFirst()

    expect(result.statusCode).toEqual(201)
    expect(address).not.toBeNull()
  })
})
