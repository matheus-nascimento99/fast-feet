import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import {
  CreateAdminUseCase,
  CreateAdminUseCaseResponse,
} from '@/domain/orders-control/application/use-cases/create-admin'
import {
  CreateDeliveryManUseCase,
  CreateDeliveryManUseCaseResponse,
} from '@/domain/orders-control/application/use-cases/create-delivery-man'
import { UserWithSameCellphoneError } from '@/domain/orders-control/application/use-cases/errors/user-with-same-cellphone'
import { UserWithSameEmailError } from '@/domain/orders-control/application/use-cases/errors/user-with-same-email'
import { UserWithSameIndividualRegistrationError } from '@/domain/orders-control/application/use-cases/errors/user-with-same-individual-registration'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(6),
  individualRegistration: z.string().min(11),
  cellphone: z.string().min(10),
  role: z.enum(['ADMIN', 'DELIVERYMAN']),
})

type CreateUserSchema = z.infer<typeof createUserSchema>

@Controller('/accounts')
export class CreateUserController {
  constructor(
    private createAdminUseCase: CreateAdminUseCase,
    private createDeliveryManUseCase: CreateDeliveryManUseCase,
  ) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createUserSchema)) body: CreateUserSchema,
  ) {
    const { role } = body
    let result: CreateAdminUseCaseResponse | CreateDeliveryManUseCaseResponse

    switch (role) {
      case 'ADMIN': {
        result = await this.createAdminUseCase.execute(body)
        break
      }
      case 'DELIVERYMAN': {
        result = await this.createDeliveryManUseCase.execute(body)
        break
      }
    }

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case UserWithSameEmailError:
          throw new ConflictException(error.message)
        case UserWithSameIndividualRegistrationError:
          throw new ConflictException(error.message)
        case UserWithSameCellphoneError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
