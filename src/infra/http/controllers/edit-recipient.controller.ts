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
import { InvalidAddressAmountPerRecipientError } from '@/domain/orders-control/application/use-cases/errors/invalid-address-amount-per-recipient'
import { RecipientWithNoOneAddressError } from '@/domain/orders-control/application/use-cases/errors/recipient-with-no-one-address'
import { UserWithSameCellphoneError } from '@/domain/orders-control/application/use-cases/errors/user-with-same-cellphone'
import { UserWithSameEmailError } from '@/domain/orders-control/application/use-cases/errors/user-with-same-email'
import { UserWithSameIndividualRegistrationError } from '@/domain/orders-control/application/use-cases/errors/user-with-same-individual-registration'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Role } from '../roles/role.enum'
import { Roles } from '../roles/roles.decorator'

const editRecipientSchema = z.object({
  name: z.string().min(1),
  individualRegistration: z.string().min(1),
  cellphone: z.string().min(1),
  email: z.string().email().min(1),
  postalCode: z.string().min(1),
  adresses: z.string().array().min(1),
})

type EditRecipientSchema = z.infer<typeof editRecipientSchema>

@Controller('/recipients/:recipient_id')
export class EditRecipientController {
  constructor(private editRecipientUseCase: EditRecipientUseCase) {}

  @Put()
  @Roles(Role.ADMIN)
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
  }
}
