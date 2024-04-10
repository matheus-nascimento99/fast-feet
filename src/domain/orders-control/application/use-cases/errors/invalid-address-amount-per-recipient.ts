import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidAddressAmountPerRecipientError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('A recipient must have until ten adresses.')
  }
}
