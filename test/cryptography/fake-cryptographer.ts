import { Cryptographer } from '@/domain/orders-control/application/cryptography/cryptographer'

export class FakeCryptographer implements Cryptographer {
  async encrypt(payload: Record<string, unknown>) {
    return JSON.stringify(payload)
  }
}
