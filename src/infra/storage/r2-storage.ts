import { randomUUID } from 'node:crypto'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'

import {
  Storage,
  UploadParams,
} from '@/domain/orders-control/application/storage/storage'

import { EnvService } from '../env/env.service'

@Injectable()
export class R2Storage implements Storage {
  private client: S3Client

  constructor(private envService: EnvService) {
    const accessKeyId = this.envService.get('AWS_ACCESS_KEY')
    const secretAccessKey = this.envService.get('AWS_SECRET_ACCESS_KEY')
    const accountId = this.envService.get('CLOUDFLARE_ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  async upload({
    filename,
    fileType,
    body,
  }: UploadParams): Promise<{ key: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${filename}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      key: uniqueFileName,
    }
  }
}
