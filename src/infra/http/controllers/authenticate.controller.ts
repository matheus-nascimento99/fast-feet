import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { Public } from '@/auth/public'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { AuthenticateUseCase } from '@/domain/orders-control/application/use-cases/authenticate'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const authenticateSchema = z.object({
  individualRegistration: z.string().min(1),
  password: z.string().min(6),
})

type AuthenticateSchema = z.infer<typeof authenticateSchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  @Public()
  @Post()
  async handle(
    @Body(new ZodValidationPipe(authenticateSchema)) body: AuthenticateSchema,
  ) {
    const result = await this.authenticateUseCase.execute(body)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAuthorizedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const accessToken = result.value.accessToken

    return {
      access_token: accessToken,
    }
  }
}
