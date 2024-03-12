import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { RecipientsRepository } from '@/domain/orders-control/application/repositories/recipient'
import { Recipient } from '@/domain/orders-control/enterprise/entities/recipient'

import { PrismaRecipientsMapper } from '../../mappers/recipients-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientsMapper.toPrisma(recipient)

    await this.prisma.recipient.create({
      data,
    })
  }

  async findById(recipientId: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id: recipientId,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientsMapper.toDomain(recipient)
  }

  async findMany({ limit, page }: PaginationParams): Promise<Recipient[]> {
    const recipients = await this.prisma.recipient.findMany({
      take: page * limit,
      skip: (page - 1) * limit,
    })

    return recipients.map((recipient) =>
      PrismaRecipientsMapper.toDomain(recipient),
    )
  }

  async save(recipientId: UniqueEntityId, recipient: Recipient): Promise<void> {
    const data = PrismaRecipientsMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: {
        id: recipientId.toString(),
      },
      data,
    })
  }

  async delete(recipientId: UniqueEntityId): Promise<void> {
    await this.prisma.recipient.delete({
      where: {
        id: recipientId.toString(),
      },
    })
  }
}
