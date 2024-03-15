/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AuthRepositories, AuthResponse } from '@/core/types/auth'

import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { Order } from '../../enterprise/entities/order'
import { AdminsRepository } from '../repositories/admin'
import { DeliveryMenRepository } from '../repositories/delivery-man'
import { OrdersRepository } from '../repositories/order'

type FetchOrdersByDeliveryManUseCaseRequest = {
  userId: string
  deliveryManId: string
} & PaginationParams

type FetchOrdersByDeliveryManUseCaseResponse = Either<
  {
    items: Order[]
  },
  ResourceNotFoundError | NotAuthorizedError
>
@Injectable()
export class FetchOrdersByDeliveryManUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private ordersRepository: OrdersRepository,
    private deliveryMenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    userId,
    deliveryManId,
    page,
    limit,
  }: FetchOrdersByDeliveryManUseCaseRequest): Promise<FetchOrdersByDeliveryManUseCaseResponse> {
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

    const orders = await this.ordersRepository.findManyByDeliveryMan(
      {
        page,
        limit,
      },
      deliveryMan.id,
    )

    return right({
      items: orders,
    })
  }
}
