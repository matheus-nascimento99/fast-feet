/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DeliveryMenRepository } from '../repositories/delivery-man'

interface DeleteDeliveryManUseCaseRequest {
  deliveryManId: string
}

type DeleteDeliveryManUseCaseResponse = Either<unknown, ResourceNotFoundError>
@Injectable()
export class DeleteDeliveryManUseCase {
  constructor(private deliveryMenRepository: DeliveryMenRepository) {}

  async execute({
    deliveryManId,
  }: DeleteDeliveryManUseCaseRequest): Promise<DeleteDeliveryManUseCaseResponse> {
    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError('Delivery man not found.'))
    }

    await this.deliveryMenRepository.delete(deliveryMan.id)

    return right({})
  }
}
