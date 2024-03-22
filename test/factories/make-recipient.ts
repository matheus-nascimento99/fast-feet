import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { DEFAULT_PASSWORD } from 'test/utils/default-password'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/orders-control/enterprise/entities/recipient'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'
import { PrismaRecipientsMapper } from '@/infra/database/mappers/recipients-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export const makeRecipient = (
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityId,
) => {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      individualRegistration: Mask.takeOffFromText(
        faker.number.int().toString(),
      ),
      email: faker.internet.email(),
      cellphone: Mask.takeOffFromText(faker.phone.number()),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return recipient
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(override: Partial<RecipientProps> = {}) {
    const recipient = makeRecipient({
      ...override,
      password: await hash(override.password ?? DEFAULT_PASSWORD, 8),
    })
    const data = PrismaRecipientsMapper.toPrisma(recipient)

    await this.prisma.user.create({
      data,
    })

    return recipient
  }
}
