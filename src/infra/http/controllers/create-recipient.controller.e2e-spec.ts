import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Create recipient (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('/ (POST)', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const token = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const createRecipient = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        individualRegistration: faker.number.int().toString(),
        cellphone: faker.phone.number(),
        password: faker.internet.password(),
      })
    expect(createRecipient.statusCode).toEqual(201)
  })
})
