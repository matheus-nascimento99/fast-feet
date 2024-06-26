import { Injectable } from '@nestjs/common'
import { Order as PrismaOrder } from '@prisma/client'

import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { LatLng } from '@/core/types/coordinates'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { OrdersRepository } from '@/domain/orders-control/application/repositories/order'
import { Order } from '@/domain/orders-control/enterprise/entities/order'
import { OrderWithDetails } from '@/domain/orders-control/enterprise/entities/value-objects/order-with-details'
import { Cacher } from '@/infra/cache/cacher'

import { PrismaOrdersMapper } from '../../mappers/orders-mapper'
import { PrismaService } from '../prisma.service'
@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(
    private prisma: PrismaService,
    private cache: Cacher,
  ) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrdersMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })

    await this.cache.del('fast-feet:orders')
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
    const cacheHit = await this.cache.get('fast-feet:orders')

    if (cacheHit) {
      const orders: PrismaOrder[] = JSON.parse(cacheHit)
      return orders.map((order) => PrismaOrdersMapper.toDomain(order))
    }

    const result = await this.prisma.order.findMany({
      take: limit,
      skip: (page - 1) * limit,
    })

    const orders = result.map((order) => PrismaOrdersMapper.toDomain(order))

    await this.cache.set('fast-feet:orders', JSON.stringify(orders))

    return orders
  }

  async findManyNearByDeliveryMan(
    { limit, page }: PaginationParams,
    { lat, lng }: LatLng,
    deliveryManId: UniqueEntityId,
  ): Promise<Order[]> {
    const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
      SELECT * from orders WHERE ( 6371 * acos( cos( radians(${lat}) ) * cos( radians( (coordinates->'lat')::double precision ) ) * cos( radians( (coordinates->'lng')::double precision ) - radians(${lng}) ) + sin( radians(${lat}) ) * sin( radians( (coordinates->'lat')::double precision ) ) ) ) <= 3 AND delivery_man_id = ${deliveryManId.toString()} LIMIT ${limit} OFFSET ${(page - 1) * limit}
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

  async findManyWithDetails({
    page,
    limit,
  }: PaginationParams): Promise<OrderWithDetails[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        deliveryMan: true,
        recipient: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return orders.map((order) => PrismaOrdersMapper.toDomainWithDetails(order))
  }

  async save(orderId: UniqueEntityId, order: Order): Promise<void> {
    const data = PrismaOrdersMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: orderId.toString(),
      },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(orderId)
  }

  async delete(orderId: UniqueEntityId): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id: orderId.toString(),
      },
    })
  }
}
