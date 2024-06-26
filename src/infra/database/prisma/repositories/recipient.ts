import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { AdressesRepository } from '@/domain/orders-control/application/repositories/address'
import { RecipientsRepository } from '@/domain/orders-control/application/repositories/recipient'
import { Recipient } from '@/domain/orders-control/enterprise/entities/recipient'

import { PrismaRecipientsMapper } from '../../mappers/recipients-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(
    private prisma: PrismaService,
    private adressesRepository: AdressesRepository,
  ) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientsMapper.toPrisma(recipient)

    await this.prisma.user.create({
      data,
    })

    await this.adressesRepository.createMany(recipient.adresses.getItems())
  }

  async findById(recipientId: string): Promise<Recipient | null> {
    const recipient = await this.prisma.user.findUnique({
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
    const recipients = await this.prisma.user.findMany({
      where: {
        role: 'RECIPIENT',
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    return recipients.map((recipient) =>
      PrismaRecipientsMapper.toDomain(recipient),
    )
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientsMapper.toDomain(recipient)
  }

  async findByIndividualRegistration(
    individualRegistration: string,
  ): Promise<Recipient | null> {
    const recipient = await this.prisma.user.findUnique({
      where: {
        individualRegistration,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientsMapper.toDomain(recipient)
  }

  async findByCellphone(cellphone: string): Promise<Recipient | null> {
    const recipient = await this.prisma.user.findUnique({
      where: {
        cellphone,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientsMapper.toDomain(recipient)
  }

  async save(recipientId: UniqueEntityId, recipient: Recipient): Promise<void> {
    const data = PrismaRecipientsMapper.toPrisma(recipient)

    await this.prisma.user.update({
      where: {
        id: recipientId.toString(),
      },
      data,
    })

    await this.adressesRepository.createMany(recipient.adresses.getNewItems())
    await this.adressesRepository.deleteMany(
      recipient.adresses.getRemovedItems(),
    )
  }

  async delete(recipientId: UniqueEntityId): Promise<void> {
    await this.adressesRepository.deleteManyByRecipientId(recipientId)

    await this.prisma.user.delete({
      where: {
        id: recipientId.toString(),
      },
    })
  }
}
