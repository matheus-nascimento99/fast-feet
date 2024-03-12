import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteDeliveryManUseCase } from '@/domain/orders-control/application/use-cases/delete-delivery-man'

@Controller('/delivery-men/:id')
export class DeleteDeliveryManController {
  constructor(private deleteDeliveryManUseCase: DeleteDeliveryManUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') deliveryManId: string) {
    const result = await this.deleteDeliveryManUseCase.execute({
      deliveryManId,
    })

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
