import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteOrderUseCase } from '@/domain/orders-control/application/use-cases/delete-order'

import { Role } from '../roles/role.enum'
import { Roles } from '../roles/roles.decorator'

@Controller('/orders/:order_id')
export class DeleteOrderController {
  constructor(private deleteOrderUseCase: DeleteOrderUseCase) {}

  @Delete()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(@Param('order_id') orderId: string) {
    const result = await this.deleteOrderUseCase.execute({ orderId })

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
