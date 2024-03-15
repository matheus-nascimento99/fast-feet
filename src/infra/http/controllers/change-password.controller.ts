import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ChangePasswordUseCase } from '@/domain/orders-control/application/use-cases/change-password'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Role } from '../roles/role.enum'
import { Roles } from '../roles/roles.decorator'

const changePasswordSchema = z.object({
  newPassword: z.string().min(1),
})

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

@Controller('/users/:user_id/change-password')
export class ChangePasswordController {
  constructor(private changePasswordUseCase: ChangePasswordUseCase) {}

  @Patch()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(
    @Param('user_id') userId: string,
    @Body(new ZodValidationPipe(changePasswordSchema))
    { newPassword }: ChangePasswordSchema,
  ) {
    try {
      const result = await this.changePasswordUseCase.execute({
        newPassword,
        userId,
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
    } catch (error) {
      console.log(error)
    }
  }
}
