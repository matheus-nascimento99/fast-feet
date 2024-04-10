import { faker } from '@faker-js/faker'
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

describe('Edit recipient (e2e)', () => {
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

  test('/:recipient_id (PUT)', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const token = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const recipient = await recipientFactory.makePrismaRecipient()

    const address1 = await addressFactory.makePrismaAddress({
      recipientId: recipient.id,
    })

    await addressFactory.makePrismaAddress({
      recipientId: recipient.id,
    })

    const address3 = await addressFactory.makePrismaAddress()

    const newRecipient = {
      name: faker.person.fullName(),
      individualRegistration: faker.number.int().toString(),
      email: faker.internet.email(),
      cellphone: faker.phone.number(),
      postalCode: faker.location.zipCode(),
      street: faker.location.streetAddress(),
      streetNumber: faker.number.int(1000),
      complement: faker.lorem.sentence(10),
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state(),
      adresses: [address1.id.toString(), address3.id.toString()],
    }

    const result = await request(app.getHttpServer())
      .put(`/recipients/${recipient.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newRecipient)

    const recipientEdited = await prisma.user.findUnique({
      where: {
        id: recipient.id.toString(),
      },
    })

    const adresses = await prisma.address.findMany({
      where: {
        recipientId: recipient.id.toString(),
      },
    })

    expect(result.statusCode).toEqual(204)
    expect(recipientEdited).toBeTruthy()
    expect(recipientEdited).toEqual(
      expect.objectContaining({
        name: newRecipient.name,
      }),
    )

    expect(adresses).toHaveLength(2)
    expect(adresses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: address1.id.toString() }),
        expect.objectContaining({ id: address3.id.toString() }),
      ]),
    )
  })
})
