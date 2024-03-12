/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'

import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { DeliveryMenRepository } from '../repositories/delivery-man'

type FetchDeliveryMenUseCaseRequest = PaginationParams

type FetchDeliveryMenUseCaseResponse = Either<
  {
    items: DeliveryMan[]
  },
  null
>
@Injectable()
export class FetchDeliveryMenUseCase {
  constructor(private deliveryMenRepository: DeliveryMenRepository) {}

  async execute({
    page,
    limit,
  }: FetchDeliveryMenUseCaseRequest): Promise<FetchDeliveryMenUseCaseResponse> {
    const deliveryMen = await this.deliveryMenRepository.findMany({
      page,
      limit,
    })

    return right({
      items: deliveryMen,
    })
  }
}
