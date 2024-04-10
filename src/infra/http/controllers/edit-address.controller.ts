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
import { EditAddressUseCase } from '@/domain/orders-control/application/use-cases/edit-address'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editAddressSchema = z.object({
  postalCode: z.string().min(1),
  street: z.string().min(1),
  streetNumber: z.coerce.number().int(),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  principal: z.coerce.boolean(),
})

type EditAddressSchema = z.infer<typeof editAddressSchema>

@Controller('/adresses/:address_id')
export class EditAddressController {
  constructor(private editAddressUseCase: EditAddressUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('address_id') addressId: string,
    @Body(new ZodValidationPipe(editAddressSchema)) body: EditAddressSchema,
  ) {
    const result = await this.editAddressUseCase.execute({ ...body, addressId })

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
