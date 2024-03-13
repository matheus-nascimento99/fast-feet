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
import { EditRecipientUseCase } from '@/domain/orders-control/application/use-cases/edit-recipient'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editRecipientSchema = z.object({
  name: z.string().min(1),
  individualRegistration: z.string().min(1),
  cellphone: z.string().min(1),
  email: z.string().email().min(1),
  postalCode: z.string().min(1),
  street: z.string().min(1),
  streetNumber: z.coerce.number(),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
})

type EditRecipientSchema = z.infer<typeof editRecipientSchema>

@Controller('/recipients/:recipient_id')
export class EditRecipientController {
  constructor(private editRecipientUseCase: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('recipient_id') recipientId: string,
    @Body(new ZodValidationPipe(editRecipientSchema)) body: EditRecipientSchema,
  ) {
    const result = await this.editRecipientUseCase.execute({
      ...body,
      recipientId,
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
