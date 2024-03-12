import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { DeliveryMenRepository } from '@/domain/orders-control/application/repositories/delivery-man'
import { DeliveryMan } from '@/domain/orders-control/enterprise/entities/delivery-man'

import { PrismaDeliveryMenMapper } from '../../mappers/deliveryMen-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaDeliveryMenRepository implements DeliveryMenRepository {
  constructor(private prisma: PrismaService) {}

  async create(deliveryMan: DeliveryMan) {
    const data = PrismaDeliveryMenMapper.toPrisma(deliveryMan)

    await this.prisma.user.create({
      data,
    })
  }

  async findMany({ limit, page }: PaginationParams): Promise<DeliveryMan[]> {
    const deliveryMen = await this.prisma.user.findMany({
      where: {
        role: 'DELIVERYMAN',
      },
      skip: (page - 1) * limit,
      take: page * limit,
    })

    return deliveryMen.map((item) => PrismaDeliveryMenMapper.toDomain(item))
  }

  async findById(deliveryManId: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: {
        id: deliveryManId,
      },
    })

    if (!deliveryMan) {
      return null
    }

    return PrismaDeliveryMenMapper.toDomain(deliveryMan)
  }

  async findByEmail(email: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!deliveryMan) {
      return null
    }

    return PrismaDeliveryMenMapper.toDomain(deliveryMan)
  }

  async findByIndividualRegistration(
    individualRegistration: string,
  ): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: {
        individualRegistration,
      },
    })

    if (!deliveryMan) {
      return null
    }

    return PrismaDeliveryMenMapper.toDomain(deliveryMan)
  }

  async findByCellphone(cellphone: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: {
        cellphone,
      },
    })

    if (!deliveryMan) {
      return null
    }

    return PrismaDeliveryMenMapper.toDomain(deliveryMan)
  }

  async save(
    deliveryManId: UniqueEntityId,
    deliveryMan: DeliveryMan,
  ): Promise<void> {
    const data = PrismaDeliveryMenMapper.toPrisma(deliveryMan)

    await this.prisma.user.update({
      where: {
        id: deliveryManId.toString(),
      },
      data,
    })
  }

  async delete(deliveryManId: UniqueEntityId): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: deliveryManId.toString(),
      },
    })
  }
}
