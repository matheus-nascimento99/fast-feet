import { UseCaseError } from '@/core/errors/use-case-error'

export class UserWithSameIndividualRegistrationError
  extends Error
  implements UseCaseError
{
  constructor(message: string) {
    super(message)
  }
}
