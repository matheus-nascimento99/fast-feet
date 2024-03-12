export class NotAuthorizedError extends Error {
  constructor(public message: string) {
    super(message)
  }
}
