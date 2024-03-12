export class InvalidAttachmentSize extends Error {
  constructor(public maxSize: number) {
    super(`This file has a size so much big. The limit is ${maxSize}MB`)
  }
}
