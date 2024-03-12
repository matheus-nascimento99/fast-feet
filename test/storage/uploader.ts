export interface Uploader {
  upload({ filename }: { filename: string }): Promise<{ key: string }>
}
