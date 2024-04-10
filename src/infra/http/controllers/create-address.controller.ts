import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateAddressUseCase } from '@/domain/orders-control/application/use-cases/create-address'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAddressSchema = z.object({
  postalCode: z.string().min(1),
  street: z.string().min(1),
  streetNumber: z.coerce.number().int(),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  principal: z.coerce.boolean(),
})

type CreateAddressSchema = z.infer<typeof createAddressSchema>

@Controller('/adresses')
export class CreateAddressController {
  constructor(private createAddressUseCase: CreateAddressUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createAddressSchema)) body: CreateAddressSchema,
  ) {
    const result = await this.createAddressUseCase.execute(body)

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      id: result.value.item,
    }
  }
}
