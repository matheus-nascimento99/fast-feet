import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import z from 'zod'

import { CurrentUser } from '@/auth/current-user'
import { UserPayload } from '@/auth/jwt.strategy'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ChangeOrderStatusUseCase } from '@/domain/orders-control/application/use-cases/change-order-status'
import { OrderStatusProps } from '@/domain/orders-control/enterprise/entities/order'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const changeOrderStatusParamSchema = z
  .enum(['retired', 'delivered', 'returned'])
  .transform((item) => item.toUpperCase())

@Controller('/orders/:order_id/change-status/:status')
export class ChangeOrderStatusController {
  constructor(private changeOrderStatusUseCase: ChangeOrderStatusUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('order_id') orderId: string,
    @Param('status', new ZodValidationPipe(changeOrderStatusParamSchema))
    status: OrderStatusProps,
  ) {
    const result = await this.changeOrderStatusUseCase.execute({
      deliveryManId: user.sub,
      orderId,
      status,
    })
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case NotAuthorizedError:
          throw new ForbiddenException(error.message)
        case BadRequestError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
