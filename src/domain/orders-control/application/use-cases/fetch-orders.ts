/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'

import { OrderWithDetails } from '../../enterprise/entities/value-objects/order-with-details'
import { OrdersRepository } from '../repositories/order'

type FetchOrdersUseCaseRequest = PaginationParams

type FetchOrdersUseCaseResponse = Either<
  {
    items: OrderWithDetails[]
  },
  null
>
@Injectable()
export class FetchOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    page,
    limit,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyWithDetails({
      page,
      limit,
    })

    return right({
      items: orders,
    })
  }
}
