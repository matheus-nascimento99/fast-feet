import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { AdressesRepository } from '@/domain/orders-control/application/repositories/address'
import { Address } from '@/domain/orders-control/enterprise/entities/address'

import { PrismaAdressesMapper } from '../../mappers/adresses-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAdressesRepository implements AdressesRepository {
  constructor(private prisma: PrismaService) {}

  async create(address: Address): Promise<void> {
    const data = PrismaAdressesMapper.toPrisma(address)

    await this.prisma.address.create({
      data,
    })
  }

  async createMany(adresses: Address[]): Promise<void> {
    const adressesIds = adresses.map((address) => {
      return address.id.toString()
    })

    await this.prisma.address.updateMany({
      where: {
        id: {
          in: adressesIds,
        },
      },
      data: {
        recipientId: adresses[0].recipientId?.toString(),
      },
    })
  }

  async findMany(): Promise<Address[]> {
    const adresses = await this.prisma.address.findMany()

    return adresses.map((address) => PrismaAdressesMapper.toDomain(address))
  }

  async findManyByRecipientId(recipientId: UniqueEntityId): Promise<Address[]> {
    const adresses = await this.prisma.address.findMany({
      where: {
        recipientId: recipientId.toString(),
      },
    })

    return adresses.map((address) => PrismaAdressesMapper.toDomain(address))
  }

  async findById(addressId: UniqueEntityId): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: {
        id: addressId.toString(),
      },
    })

    if (!address) {
      return null
    }

    return PrismaAdressesMapper.toDomain(address)
  }

  async save(addressId: UniqueEntityId, address: Address): Promise<void> {
    const data = PrismaAdressesMapper.toPrisma(address)

    await this.prisma.address.update({
      where: {
        id: addressId.toString(),
      },
      data,
    })
  }

  async delete(addressId: UniqueEntityId): Promise<void> {
    await this.prisma.address.delete({
      where: {
        id: addressId.toString(),
      },
    })
  }

  async deleteMany(adresses: Address[]): Promise<void> {
    const adressesIds = adresses.map((address) => {
      return address.id.toString()
    })

    await this.prisma.address.deleteMany({
      where: {
        id: {
          in: adressesIds,
        },
      },
    })
  }

  async deleteManyByRecipientId(recipientId: UniqueEntityId): Promise<void> {
    await this.prisma.address.deleteMany({
      where: {
        recipientId: recipientId.toString(),
      },
    })
  }
}
