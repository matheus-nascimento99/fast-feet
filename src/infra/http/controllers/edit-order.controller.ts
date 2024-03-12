import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EditOrderUseCase } from '@/domain/orders-control/application/use-cases/edit-order'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editOrderSchema = z.object({
  deliveryManId: z.string().uuid(),
  recipientId: z.string().uuid(),
  coordinates: z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
  }),
})

type EditOrderSchema = z.infer<typeof editOrderSchema>

@Controller('/orders/:order_id')
export class EditOrderController {
  constructor(private editOrderUseCase: EditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editOrderSchema)) body: EditOrderSchema,
    @Param('order_id') orderId: string,
  ) {
    const result = await this.editOrderUseCase.execute({ orderId, ...body })

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
