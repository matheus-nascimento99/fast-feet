export class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  equals(vo: ValueObject<unknown>): boolean {
    if (vo === undefined) {
      return false
    }

    return JSON.stringify(vo) === JSON.stringify(this.props)
  }
}
