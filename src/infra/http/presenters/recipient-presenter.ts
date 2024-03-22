import { Recipient } from '@/domain/orders-control/enterprise/entities/recipient'

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      individualRegistration: recipient.individualRegistration.value,
      cellphone: recipient.cellphone,
      email: recipient.email,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }
  }
}
