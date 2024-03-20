import { Module } from '@nestjs/common'

import { OnOrderStatusAltered } from '@/domain/notification/application/subscribers/on-order-status-altered'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnOrderStatusAltered,
    SendNotificationUseCase,
    ReadNotificationUseCase,
  ],
})
export class EventsModule {}
