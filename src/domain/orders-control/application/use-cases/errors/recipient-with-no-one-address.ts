import { UseCaseError } from '@/core/errors/use-case-error'

export class RecipientWithNoOneAddressError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('A recipient must have at least one address.')
  }
}
