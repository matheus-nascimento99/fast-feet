/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { OrdersRepository } from '../repositories/order'

interface DeleteOrderUseCaseRequest {
  orderId: string
}

type DeleteOrderUseCaseResponse = Either<unknown, ResourceNotFoundError>
@Injectable()
export class DeleteOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError('Order not found.'))
    }

    await this.ordersRepository.delete(order.id)

    return right({})
  }
}
