/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Mask } from '../../enterprise/entities/value-objects/mask'
import { DeliveryMenRepository } from '../repositories/delivery-man'

interface EditDeliveryManUseCaseRequest {
  deliveryManId: string
  name: string
  individualRegistration: string
  email: string
  cellphone: string
}

type EditDeliveryManUseCaseResponse = Either<unknown, ResourceNotFoundError>
@Injectable()
export class EditDeliveryManUseCase {
  constructor(private deliveryMenRepository: DeliveryMenRepository) {}

  async execute({
    deliveryManId,
    name,
    individualRegistration,
    email,
    cellphone,
  }: EditDeliveryManUseCaseRequest): Promise<EditDeliveryManUseCaseResponse> {
    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new ResourceNotFoundError('Delivery man not found.'))
    }

    deliveryMan.name = name
    deliveryMan.individualRegistration = Mask.takeOffFromText(
      individualRegistration,
    )
    deliveryMan.email = email
    deliveryMan.cellphone = Mask.takeOffFromText(cellphone)

    await this.deliveryMenRepository.save(deliveryMan.id, deliveryMan)

    return right({})
  }
}
