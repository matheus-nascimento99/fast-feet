export class Mask {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    return new Mask(value)
  }

  static takeOffFromText(value: string) {
    const valueWithoutMask = value.replace(/[^a-zA-Z0-9]/g, '')
    return new Mask(valueWithoutMask)
  }
}
