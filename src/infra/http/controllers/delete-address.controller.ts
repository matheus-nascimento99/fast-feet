import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteAddressUseCase } from '@/domain/orders-control/application/use-cases/delete-address'

@Controller('/adresses/:id')
export class DeleteAddressController {
  constructor(private deleteAddressUseCase: DeleteAddressUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') addressId: string) {
    const result = await this.deleteAddressUseCase.execute({
      addressId,
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
