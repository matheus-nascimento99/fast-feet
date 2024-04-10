import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CreateRecipientUseCase } from '@/domain/orders-control/application/use-cases/create-recipient'
import { InvalidAddressAmountPerRecipientError } from '@/domain/orders-control/application/use-cases/errors/invalid-address-amount-per-recipient'
import { RecipientWithNoOneAddressError } from '@/domain/orders-control/application/use-cases/errors/recipient-with-no-one-address'
import { UserWithSameCellphoneError } from '@/domain/orders-control/application/use-cases/errors/user-with-same-cellphone'
import { UserWithSameEmailError } from '@/domain/orders-control/application/use-cases/errors/user-with-same-email'
import { UserWithSameIndividualRegistrationError } from '@/domain/orders-control/application/use-cases/errors/user-with-same-individual-registration'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { RecipientPresenter } from '../presenters/recipient-presenter'
import { Role } from '../roles/role.enum'
import { Roles } from '../roles/roles.decorator'

const createRecipientSchema = z.object({
  name: z.string().min(1),
  individualRegistration: z.string().min(1),
  cellphone: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(1),
  adresses: z.string().array().min(1),
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
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case UserWithSameEmailError:
          throw new BadRequestException(error.message)
        case UserWithSameCellphoneError:
          throw new BadRequestException(error.message)
        case UserWithSameIndividualRegistrationError:
          throw new BadRequestException(error.message)
        case InvalidAddressAmountPerRecipientError:
          throw new BadRequestException(error.message)
        case RecipientWithNoOneAddressError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    return RecipientPresenter.toHTTP(result.value.item)
  }
}
