import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { LatLng } from '@/core/types/coordinates'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Order } from '../../enterprise/entities/order'
import { DeliveryMenRepository } from '../repositories/delivery-man'
import { OrdersRepository } from '../repositories/order'
import { RecipientsRepository } from '../repositories/recipient'

interface CreateOrderUseCaseRequest {
  deliveryManId: string
  recipientId: string
  coordinates: LatLng
}

type CreateOrderUseCaseResponse = Either<
  {
    item: Order
  },
  ResourceNotFoundError
>
@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientsRepository: RecipientsRepository,
    private deliveryMenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    deliveryManId,
    recipientId,
    coordinates,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError('Recipient not found.'))
    }

    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError('Delivery man not found.'))
    }

    const order = Order.create({
      deliveryManId: new UniqueEntityId(deliveryManId),
      recipientId: new UniqueEntityId(recipientId),
      coordinates,
    })

    await this.ordersRepository.create(order)

    return right({
      item: order,
    })
  }
}
