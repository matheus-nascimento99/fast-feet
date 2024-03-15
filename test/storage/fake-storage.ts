import { randomUUID } from 'crypto'

import {
  Storage,
  UploadParams,
} from '@/domain/orders-control/application/storage/storage'

export class FakeStorage implements Storage {
  async upload({ filename }: UploadParams) {
    const id = randomUUID()
    const key = `${id}_${filename}`

    return { key }
  }
}
