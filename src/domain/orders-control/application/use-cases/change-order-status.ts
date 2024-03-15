/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { OrderStatusProps } from '../../enterprise/entities/order'
import { DeliveryMenRepository } from '../repositories/delivery-man'
import { OrdersRepository } from '../repositories/order'

interface ChangeOrderStatusUseCaseRequest {
  deliveryManId: string
  orderId: string
  status: OrderStatusProps
}

type ChangeOrderStatusUseCaseResponse = Either<
  unknown,
  ResourceNotFoundError | NotAuthorizedError | BadRequestError
>
@Injectable()
export class ChangeOrderStatusUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryMenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    deliveryManId,
    orderId,
    status,
  }: ChangeOrderStatusUseCaseRequest): Promise<ChangeOrderStatusUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError('Order not found.'))
    }

    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError('Delivery man not found.'))
    }

    if (!deliveryMan.id.equals(order.deliveryManId)) {
      return left(
        new NotAuthorizedError('This order is not from this delivery man'),
      )
    }

    if (status === 'DELIVERED' && !order.attachment) {
      return left(
        new BadRequestError('To finish an order, it must have a photo before.'),
      )
    }

    order.status = status

    await this.ordersRepository.save(order.id, order)

    return right({})
  }
}
