import { Module } from '@nestjs/common'

import { AdminsRepository } from '@/domain/orders-control/application/repositories/admin'
import { DeliveryMenRepository } from '@/domain/orders-control/application/repositories/delivery-man'
import { OrdersRepository } from '@/domain/orders-control/application/repositories/order'
import { RecipientsRepository } from '@/domain/orders-control/application/repositories/recipient'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAdminsRepository } from './prisma/repositories/admin'
import { PrismaDeliveryMenRepository } from './prisma/repositories/delivery-man'
import { PrismaOrdersRepository } from './prisma/repositories/order'
import { PrismaRecipientsRepository } from './prisma/repositories/recipient'

@Module({
  providers: [
    PrismaService,
    { provide: AdminsRepository, useClass: PrismaAdminsRepository },
    { provide: DeliveryMenRepository, useClass: PrismaDeliveryMenRepository },
    { provide: OrdersRepository, useClass: PrismaOrdersRepository },
    { provide: RecipientsRepository, useClass: PrismaRecipientsRepository },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    DeliveryMenRepository,
    OrdersRepository,
    RecipientsRepository,
  ],
})
export class DatabaseModule {}
