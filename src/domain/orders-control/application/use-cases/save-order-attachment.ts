import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

import { Attachment } from '../../enterprise/entities/attachment'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/order'
import { Storage } from '../storage/storage'
import { InvalidAttachmentSize } from './errors/invalid-attachment-size'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'

interface SaveOrderAttachmentUseCaseRequest {
  orderId: string
  filename: string
  fileType: string
  size: number
  body: Buffer
}
type SaveOrderAttachmentUseCaseResponse = Either<
  { item: Order },
  ResourceNotFoundError | InvalidAttachmentSize | InvalidAttachmentType
>

@Injectable()
export class SaveOrderAttachmentUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private storage: Storage,
  ) {}

  async execute({
    orderId,
    filename,
    fileType,
    size,
    body,
  }: SaveOrderAttachmentUseCaseRequest): Promise<SaveOrderAttachmentUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError('Order not found.'))
    }

    const MAX_FILE_SIZE = 5 // 5 MB
    const MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * MAX_FILE_SIZE // 5242880 BYTES

    if (!/^image\/(jpeg|png|jpg)$/.test(fileType)) {
      return left(new InvalidAttachmentType(fileType))
    }

    if (size > MAX_FILE_SIZE_IN_BYTES) {
      return left(new InvalidAttachmentSize(MAX_FILE_SIZE))
    }

    const { key } = await this.storage.upload({ filename, body, fileType })

    const attachment = Attachment.create({ link: key })

    order.attachment = attachment

    await this.ordersRepository.save(new UniqueEntityId(orderId), order)

    return right({ item: order })
  }
}
