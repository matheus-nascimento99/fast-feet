import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

import { CurrentUser } from '@/auth/current-user'
import { UserPayload } from '@/auth/jwt.strategy'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

@Controller('/notifications/:notification_id/read')
export class ReadNotificationController {
  constructor(private readNotificationUseCase: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notification_id') notificationId: string,
  ) {
    const result = await this.readNotificationUseCase.execute({
      recipientId: user.sub,
      notificationId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case NotAuthorizedError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
