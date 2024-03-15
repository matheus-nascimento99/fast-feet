import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

import { FetchDeliveryMenUseCase } from '@/domain/orders-control/application/use-cases/fetch-delivery-men'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliveryManPresenter } from '../presenters/delivery-man-presenter'
import { Role } from '../roles/role.enum'
import { Roles } from '../roles/roles.decorator'

const fetchDeliveryMenSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
})

type FetchDeliveryMenSchema = z.infer<typeof fetchDeliveryMenSchema>
@Controller('/delivery-men')
export class FetchDeliveryMenController {
  constructor(private fetchDeliveryMenUseCase: FetchDeliveryMenUseCase) {}
  @Get()
  @Roles(Role.ADMIN)
  async handle(
    @Query(new ZodValidationPipe(fetchDeliveryMenSchema))
    query: FetchDeliveryMenSchema,
  ) {
    const result = await this.fetchDeliveryMenUseCase.execute(query)

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return result.value.items.map((item) => DeliveryManPresenter.toHTTP(item))
  }
}
