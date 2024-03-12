import { UseCaseError } from '@/core/errors/use-case-error'

export class UserWithSameEmailError extends Error implements UseCaseError {
  constructor(message: string) {
    super(message)
  }
}
