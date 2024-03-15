import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { InvalidAttachmentSize } from '@/domain/orders-control/application/use-cases/errors/invalid-attachment-size'
import { InvalidAttachmentType } from '@/domain/orders-control/application/use-cases/errors/invalid-attachment-type'
import { SaveOrderAttachmentUseCase } from '@/domain/orders-control/application/use-cases/save-order-attachment'

@Controller('/orders/:order_id/save-attachment')
export class SaveOrderAttachmentController {
  constructor(private saveOrderAttachmentUseCase: SaveOrderAttachmentUseCase) {}

  @Patch()
  @HttpCode(204)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5, // 5mb
          }),
          new FileTypeValidator({
            fileType: '.(jpg|png|jpeg)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('order_id') orderId: string,
  ) {
    const result = await this.saveOrderAttachmentUseCase.execute({
      orderId,
      body: file.buffer,
      filename: file.originalname,
      fileType: file.mimetype,
      size: file.size,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case InvalidAttachmentSize:
          throw new BadRequestException(error.message)
        case InvalidAttachmentType:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
