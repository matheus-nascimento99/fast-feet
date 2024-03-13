import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteRecipientUseCase } from '@/domain/orders-control/application/use-cases/delete-recipient'

@Controller('/recipients/:recipient_id')
export class DeleteRecipientController {
  constructor(private deleteRecipientUseCase: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('recipient_id') recipientId: string) {
    const result = await this.deleteRecipientUseCase.execute({ recipientId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
