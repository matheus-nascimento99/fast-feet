import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import { Attachment } from '@/domain/orders-control/enterprise/entities/attachment'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Change order status (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let orderFactory: OrderFactory
  let deliveryManFactory: DeliveryManFactory
  let recipientFactory: RecipientFactory
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        OrderFactory,
        RecipientFactory,
        DeliveryManFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  it('/:order_id/change-status/:status [RETIRED] (PATCH)', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const token = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: 'DELIVERYMAN',
    })

    const order = await orderFactory.makePrismaOrder({
      deliveryManId: deliveryMan.id.toString(),
      recipientId: recipient.id.toString(),
    })

    const result = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/change-status/retired`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    const orderEdited = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      },
    })

    expect(result.statusCode).toEqual(204)
    expect(orderEdited).toBeTruthy()
    expect(orderEdited).toEqual(expect.objectContaining({ status: 'RETIRED' }))
  })

  it('/:order_id/change-status/:status [RETURNED] (PATCH)', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const token = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: 'DELIVERYMAN',
    })

    const order = await orderFactory.makePrismaOrder({
      deliveryManId: deliveryMan.id.toString(),
      recipientId: recipient.id.toString(),
    })

    const result = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/change-status/returned`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    const orderEdited = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      },
    })

    expect(result.statusCode).toEqual(204)
    expect(orderEdited).toBeTruthy()
    expect(orderEdited).toEqual(expect.objectContaining({ status: 'RETURNED' }))
  })

  it('/:order_id/change-status/:status [DELIVERED] (PATCH)', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const token = jwt.sign({
      sub: deliveryMan.id.toString(),
      role: 'DELIVERYMAN',
    })

    const order = await orderFactory.makePrismaOrder({
      deliveryManId: deliveryMan.id.toString(),
      recipientId: recipient.id.toString(),
      attachment: Attachment.create({ link: faker.image.url() }),
    })

    const result = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/change-status/delivered`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    const orderEdited = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      },
    })

    expect(result.statusCode).toEqual(204)
    expect(orderEdited).toBeTruthy()
    expect(orderEdited).toEqual(
      expect.objectContaining({ status: 'DELIVERED' }),
    )
  })
})
