import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit address (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let recipientFactory: RecipientFactory
  let addressFactory: AddressFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, AddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    recipientFactory = moduleRef.get(RecipientFactory)
    addressFactory = moduleRef.get(AddressFactory)

    await app.init()
  })

  test('/adresses [POST]', async () => {
    const user = await recipientFactory.makePrismaRecipient()
    const token = jwt.sign({ sub: user.id.toString(), role: 'RECIPIENT' })

    const address = await addressFactory.makePrismaAddress()

    const newAddress = {
      postalCode: faker.location.zipCode(),
      street: faker.location.streetAddress(),
      streetNumber: faker.number.int(1000),
      complement: faker.lorem.sentence(10),
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state(),
    }

    const result = await request(app.getHttpServer())
      .put(`/adresses/${address.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newAddress)

    const addressEdited = await prisma.address.findUnique({
      where: {
        id: address.id.toString(),
      },
    })

    expect(result.statusCode).toEqual(204)
    expect(addressEdited).not.toBeNull()
    expect(addressEdited).toMatchObject({
      street: newAddress.street,
    })
  })
})
