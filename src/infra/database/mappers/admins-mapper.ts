import { Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import { Admin } from '@/domain/orders-control/enterprise/entities/admin'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'

export class PrismaAdminsMapper {
  static toDomain(raw: PrismaUser): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        cellphone: Mask.create(raw.cellphone),
        individualRegistration: Mask.create(raw.individualRegistration),
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      individualRegistration: admin.individualRegistration.value,
      cellphone: admin.cellphone.value,
      password: admin.password,
      role: 'ADMIN',
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt ?? null,
    }
  }
}
