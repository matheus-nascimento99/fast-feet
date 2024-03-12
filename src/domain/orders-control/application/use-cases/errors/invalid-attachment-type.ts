export class InvalidAttachmentType extends Error {
  constructor(public type: string) {
    super(`Type ${type} is a invalid type to upload attachment.`)
  }
}
