import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { AdminsRepository } from '@/domain/orders-control/application/repositories/admin'
import { Admin } from '@/domain/orders-control/enterprise/entities/admin'

import { PrismaAdminsMapper } from '../../mappers/admins-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async create(admin: Admin) {
    const data = PrismaAdminsMapper.toPrisma(admin)

    await this.prisma.user.create({
      data,
    })
  }

  async findMany({ limit, page }: PaginationParams): Promise<Admin[]> {
    const admins = await this.prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },
      take: page * limit,
      skip: (page - 1) * limit,
    })

    return admins.map((admin) => PrismaAdminsMapper.toDomain(admin))
  }

  async findById(adminId: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        id: adminId,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminsMapper.toDomain(admin)
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminsMapper.toDomain(admin)
  }

  async findByIndividualRegistration(
    individualRegistration: string,
  ): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        individualRegistration,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminsMapper.toDomain(admin)
  }

  async findByCellphone(cellphone: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        cellphone,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminsMapper.toDomain(admin)
  }

  async save(adminId: UniqueEntityId, admin: Admin): Promise<void> {
    const data = PrismaAdminsMapper.toPrisma(admin)

    await this.prisma.user.update({
      where: {
        id: adminId.toString(),
      },
      data,
    })
  }

  async delete(adminId: UniqueEntityId): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: adminId.toString(),
      },
    })
  }
}
