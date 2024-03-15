import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import z from 'zod'

import { CurrentUser } from '@/auth/current-user'
import { UserPayload } from '@/auth/jwt.strategy'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FetchOrdersByDeliveryManUseCase } from '@/domain/orders-control/application/use-cases/fetch-orders-by-delivery-man'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'

const fetchOrdersSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
})

type FetchOrdersSchema = z.infer<typeof fetchOrdersSchema>

@Controller('/orders/:delivery_man_id/delivery-man')
export class FetchOrdersByDeliveryManController {
  constructor(
    private fetchOrdersByDeliveryManUseCase: FetchOrdersByDeliveryManUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('delivery_man_id') deliveryManId: string,
    @Query(new ZodValidationPipe(fetchOrdersSchema)) query: FetchOrdersSchema,
  ) {
    const result = await this.fetchOrdersByDeliveryManUseCase.execute({
      deliveryManId,
      userId: user.sub,
      ...query,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case NotAuthorizedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    return result.value.items.map((item) => OrderPresenter.toHTTP(item))
  }
}
