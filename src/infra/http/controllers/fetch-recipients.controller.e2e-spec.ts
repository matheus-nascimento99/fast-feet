import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch recipients (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('/ (GET)', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const token = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    for (let index = 0; index < 10; index++) {
      await recipientFactory.makePrismaRecipient()
    }

    const result = await request(app.getHttpServer())
      .get(`/recipients`)
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
  })

  test('/ (GET) [paginated]', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const token = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const result = await request(app.getHttpServer())
      .get(`/recipients?page=2&limit=8`)
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
  })
})
