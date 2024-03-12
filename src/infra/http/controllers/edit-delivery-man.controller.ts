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
import { EditDeliveryManUseCase } from '@/domain/orders-control/application/use-cases/edit-delivery-man'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editDeliveryManSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  individualRegistration: z.string().min(11),
  cellphone: z.string().min(10),
})

type EditDeliveryManSchema = z.infer<typeof editDeliveryManSchema>

@Controller('/delivery-men/:id')
export class EditDeliveryManController {
  constructor(private editDeliveryManUseCase: EditDeliveryManUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editDeliveryManSchema))
    body: EditDeliveryManSchema,
    @Param('id') deliveryManId: string,
  ) {
    const result = await this.editDeliveryManUseCase.execute({
      deliveryManId,
      ...body,
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
