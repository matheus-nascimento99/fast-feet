import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

import { CreateRecipientUseCase } from '@/domain/orders-control/application/use-cases/create-recipient'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Role } from '../roles/role.enum'
import { Roles } from '../roles/roles.decorator'

const createRecipientSchema = z.object({
  name: z.string().min(1),
  individualRegistration: z.string().min(1),
  cellphone: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(1),
})

type CreateRecipientSchema = z.infer<typeof createRecipientSchema>

@Controller('/recipients')
export class CreateRecipientController {
  constructor(private createRecipientUseCase: CreateRecipientUseCase) {}
  @Post()
  @Roles(Role.ADMIN)
  async handle(
    @Body(new ZodValidationPipe(createRecipientSchema))
    body: CreateRecipientSchema,
  ) {
    const result = await this.createRecipientUseCase.execute(body)

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
