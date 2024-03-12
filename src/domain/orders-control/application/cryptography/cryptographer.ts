export abstract class Cryptographer {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
