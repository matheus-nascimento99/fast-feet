/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { LatLng } from '@/core/types/coordinates'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { DeliveryMenRepository } from '../repositories/delivery-man'
import { OrdersRepository } from '../repositories/order'
import { RecipientsRepository } from '../repositories/recipient'

interface EditOrderUseCaseRequest {
  orderId: string
  deliveryManId: string
  coordinates: LatLng
  recipientId: string
}

type EditOrderUseCaseResponse = Either<unknown, ResourceNotFoundError>

@Injectable()
export class EditOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryMenRepository: DeliveryMenRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    orderId,
    deliveryManId,
    recipientId,
    coordinates,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError('Order not found.'))
    }

    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError('Delivery man not found.'))
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError('Recipient not found.'))
    }

    order.deliveryManId = new UniqueEntityId(deliveryManId)
    order.recipientId = new UniqueEntityId(recipientId)
    order.coordinates = coordinates

    await this.ordersRepository.save(order.id, order)

    return right({})
  }
}
