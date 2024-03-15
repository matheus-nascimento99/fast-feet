export type UploadParams = {
  filename: string
  fileType: string
  body: Buffer
}
export abstract class Storage {
  abstract upload({
    filename,
    fileType,
    body,
  }: UploadParams): Promise<{ key: string }>
}
