import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { DEFAULT_PASSWORD } from 'test/utils/default-password'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import {
  Admin,
  AdminProps,
} from '@/domain/orders-control/enterprise/entities/admin'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'
import { PrismaAdminsMapper } from '@/infra/database/mappers/admins-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export const makeAdmin = (
  override: Partial<AdminProps> = {},
  id?: UniqueEntityId,
) => {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      cellphone: Mask.takeOffFromText(faker.phone.number()),
      individualRegistration: Mask.takeOffFromText(
        faker.number.int().toString(),
      ),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return admin
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(override: Partial<AdminProps> = {}) {
    const admin = makeAdmin({
      ...override,
      password: await hash(override.password ?? DEFAULT_PASSWORD, 8),
    })
    const data = PrismaAdminsMapper.toPrisma(admin)

    await this.prisma.user.create({
      data,
    })

    return admin
  }
}
