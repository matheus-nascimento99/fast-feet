import { Injectable } from '@nestjs/common'
import { Order as PrismaOrder } from '@prisma/client'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { LatLng } from '@/core/types/coordinates'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { OrdersRepository } from '@/domain/orders-control/application/repositories/order'
import { Order } from '@/domain/orders-control/enterprise/entities/order'

import { PrismaOrdersMapper } from '../../mappers/orders-mapper'
import { PrismaService } from '../prisma.service'
@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrdersMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrdersMapper.toDomain(order)
  }

  async findMany({ limit, page }: PaginationParams): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      take: limit,
      skip: (page - 1) * limit,
    })

    return orders.map((order) => PrismaOrdersMapper.toDomain(order))
  }

  async findManyNearByDeliveryMan(
    { limit, page }: PaginationParams,
    { lat, lng }: LatLng,
    deliveryManId: UniqueEntityId,
  ): Promise<Order[]> {
    const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
      SELECT * from orders WHERE ( 6371 * acos( cos( radians(${lat}) ) * cos( radians( coordinates->'lat' ) ) * cos( radians( coordinates->'lng' ) - radians(${lng}) ) + sin( radians(${lat}) ) * sin( radians( coordinates->'lat' ) ) ) ) <= 10 AND delivery_man_id = ${deliveryManId.toString()} LIMIT(${(page - 1) * limit}, ${page * limit})
    `

    return orders.map((order) => PrismaOrdersMapper.toDomain(order))
  }

  async findManyByDeliveryMan(
    { limit, page }: PaginationParams,
    deliveryManId: UniqueEntityId,
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        deliveryManId: deliveryManId.toString(),
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return orders.map((order) => PrismaOrdersMapper.toDomain(order))
  }

  async save(orderId: UniqueEntityId, order: Order): Promise<void> {
    const data = PrismaOrdersMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: orderId.toString(),
      },
      data,
    })
  }

  async delete(orderId: UniqueEntityId): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id: orderId.toString(),
      },
    })
  }
}
