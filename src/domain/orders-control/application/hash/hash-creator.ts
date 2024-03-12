export abstract class HashCreator {
  abstract create(plain: string): Promise<string>
}
