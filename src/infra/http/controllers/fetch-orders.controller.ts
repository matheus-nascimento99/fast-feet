import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

import { FetchOrdersUseCase } from '@/domain/orders-control/application/use-cases/fetch-orders'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'
import { Role } from '../roles/role.enum'
import { Roles } from '../roles/roles.decorator'

const fetchOrdersQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
})

type FetchOrdersQuerySchema = z.infer<typeof fetchOrdersQuerySchema>

@Controller('/orders')
export class FetchOrdersController {
  constructor(private fetchOrdersUseCase: FetchOrdersUseCase) {}

  @Get()
  @Roles(Role.ADMIN)
  async handle(
    @Query(new ZodValidationPipe(fetchOrdersQuerySchema))
    query: FetchOrdersQuerySchema,
  ) {
    const result = await this.fetchOrdersUseCase.execute(query)

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return result.value.items.map((item) =>
      OrderPresenter.toHTTPWithDetails(item),
    )
  }
}
