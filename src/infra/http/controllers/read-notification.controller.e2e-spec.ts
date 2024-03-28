import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { NotificationFactory } from 'test/factories/make-notification'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Read notification (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let recipientFactory: RecipientFactory
  let notificationFactory: NotificationFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    recipientFactory = moduleRef.get(RecipientFactory)
    notificationFactory = moduleRef.get(NotificationFactory)

    await app.init()
  })

  test('/notifications/:notification_id/read [PATCH]', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    const token = jwt.sign({
      sub: recipient.id.toString(),
      role: 'RECIPIENT',
    })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: recipient.id,
    })

    const result = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    const notificationRead = await prisma.notification.findFirst({
      where: {
        recipientId: recipient.id.toString(),
      },
    })

    expect(result.statusCode).toEqual(204)
    expect(notificationRead).not.toBeNull()
    expect(notificationRead).toMatchObject({
      readAt: expect.any(Date),
    })
  })
})
