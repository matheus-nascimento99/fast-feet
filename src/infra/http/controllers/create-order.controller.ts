import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CreateOrderUseCase } from '@/domain/orders-control/application/use-cases/create-order'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createOrderSchema = z.object({
  deliveryManId: z.string().uuid(),
  recipientId: z.string().uuid(),
  coordinates: z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
  }),
})

type CreateOrderSchema = z.infer<typeof createOrderSchema>

@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createOrderSchema)) body: CreateOrderSchema,
  ) {
    const result = await this.createOrderUseCase.execute(body)

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
