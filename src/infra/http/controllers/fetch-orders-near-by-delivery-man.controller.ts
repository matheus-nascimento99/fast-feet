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
import { FetchOrdersNearByDeliveryManUseCase } from '@/domain/orders-control/application/use-cases/fetch-orders-near-by-delivery-man'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'

const fetchOrdersNearByDeliveryManQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  latitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

type FetchOrdersNearByDeliveryManQuerySchema = z.infer<
  typeof fetchOrdersNearByDeliveryManQuerySchema
>

@Controller('/orders/:delivery_man_id/near')
export class FetchOrdersNearByDeliveryManController {
  constructor(
    private fetchOrdersNearByDeliveryManUseCase: FetchOrdersNearByDeliveryManUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('delivery_man_id') deliveryManId: string,
    @Query(new ZodValidationPipe(fetchOrdersNearByDeliveryManQuerySchema))
    query: FetchOrdersNearByDeliveryManQuerySchema,
  ) {
    const result = await this.fetchOrdersNearByDeliveryManUseCase.execute({
      coordinates: {
        lat: query.latitude,
        lng: query.longitude,
      },
      userId: user.sub,
      deliveryManId,
      limit: query.limit,
      page: query.page,
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
