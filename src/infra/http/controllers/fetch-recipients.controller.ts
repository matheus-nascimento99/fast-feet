import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

import { FetchRecipientsUseCase } from '@/domain/orders-control/application/use-cases/fetch-recipients'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { RecipientPresenter } from '../presenters/recipient-presenter'

const fetchRecipientsQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
})

type FetchRecipientsQuerySchema = z.infer<typeof fetchRecipientsQuerySchema>

@Controller('/recipients')
export class FetchRecipientsController {
  constructor(private fetchRecipientsUseCase: FetchRecipientsUseCase) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(fetchRecipientsQuerySchema))
    query: FetchRecipientsQuerySchema,
  ) {
    const result = await this.fetchRecipientsUseCase.execute(query)

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return result.value.items.map((item) => RecipientPresenter.toHTTP(item))
  }
}
