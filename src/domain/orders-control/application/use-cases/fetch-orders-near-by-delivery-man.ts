/* eslint-disable @typescript-eslint/no-empty-interface */
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { LatLng } from '@/core/types/coordinates'

import { Order } from '../../enterprise/entities/order'
import { DeliveryMenRepository } from '../repositories/delivery-man'
import { OrdersRepository } from '../repositories/order'

type FetchOrdersNearByDeliveryManUseCaseRequest = {
  deliveryManId: string
  coordinates: LatLng
} & PaginationParams

type FetchOrdersNearByDeliveryManUseCaseResponse = Either<
  {
    items: Order[]
  },
  ResourceNotFoundError
>

export class FetchOrdersNearByDeliveryManUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryMenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    deliveryManId,
    coordinates,
    page,
    limit,
  }: FetchOrdersNearByDeliveryManUseCaseRequest): Promise<FetchOrdersNearByDeliveryManUseCaseResponse> {
    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError('Delivery man not found.'))
    }

    const orders = await this.ordersRepository.findManyNearByDeliveryMan(
      {
        page,
        limit,
      },
      coordinates,
      deliveryMan.id,
    )

    return right({
      items: orders,
    })
  }
}
