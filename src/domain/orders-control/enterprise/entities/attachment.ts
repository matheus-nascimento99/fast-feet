import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/value-objects/unique-entity-id'

export interface AttachmentProps {
  link: string
}

export class Attachment extends Entity<AttachmentProps> {
  get link() {
    return this.props.link
  }

  set link(value: string) {
    this.props.link = value
  }

  static create(props: AttachmentProps, id?: UniqueEntityId) {
    const attachment = new Attachment({ ...props }, id)

    return attachment
  }
}
