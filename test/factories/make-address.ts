import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'
import {
  Address,
  AddressProps,
} from '@/domain/orders-control/enterprise/entities/address'
import { Mask } from '@/domain/orders-control/enterprise/entities/value-objects/mask'

export const makeAddress = (
  override: Partial<AddressProps> = {},
  id?: UniqueEntityId,
) => {
  const address = Address.create(
    {
      postalCode: Mask.takeOffFromText(faker.location.zipCode()),
      street: faker.location.streetAddress(),
      streetNumber: faker.number.int(1000),
      complement: faker.lorem.sentence(10),
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state(),
      ...override,
    },
    id,
  )

  return address
}
