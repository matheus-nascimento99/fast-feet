import { randomUUID } from 'crypto'

import { Uploader } from '../uploader'

export class FakeUploader implements Uploader {
  async upload({
    filename,
  }: {
    filename: string
    mimeType: string
    body: Buffer
  }) {
    const id = randomUUID()
    const key = `${id}_${filename}`

    return { key }
  }
}
