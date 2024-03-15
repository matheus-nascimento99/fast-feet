/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AuthRepositories, AuthResponse } from '@/core/types/auth'
import { LatLng } from '@/core/types/coordinates'

import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { Order } from '../../enterprise/entities/order'
import { DeliveryMenRepository } from '../repositories/delivery-man'
import { OrdersRepository } from '../repositories/order'

type FetchOrdersNearByDeliveryManUseCaseRequest = {
  userId: string
  deliveryManId: string
  coordinates: LatLng
} & PaginationParams

type FetchOrdersNearByDeliveryManUseCaseResponse = Either<
  {
    items: Order[]
  },
  ResourceNotFoundError | NotAuthorizedError
>
@Injectable()
export class FetchOrdersNearByDeliveryManUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryMenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    userId,
    deliveryManId,
    coordinates,
    page,
    limit,
  }: FetchOrdersNearByDeliveryManUseCaseRequest): Promise<FetchOrdersNearByDeliveryManUseCaseResponse> {
    let user: AuthResponse | null = null
    const { ordersRepository, ...rest } = this //eslint-disable-line

    const repositories = Object.keys({
      ...rest,
    })

    for (const repository of repositories) {
      user = await this[repository as AuthRepositories].findById(userId)

      if (user) {
        break
      }
    }

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError('Delivery man not found.'))
    }

    if (
      user instanceof DeliveryMan &&
      user.id.toString() !== deliveryMan.id.toString()
    ) {
      return left(new NotAuthorizedError('Not authorized.'))
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
