import { Recipient } from '@/domain/orders-control/enterprise/entities/recipient'

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      individualRegistration: recipient.individualRegistration.value,
      cellphone: recipient.cellphone,
      email: recipient.email,
      postalCode: recipient.postalCode,
      street: recipient.street,
      streetNumber: recipient.streetNumber,
      complement: recipient.complement,
      neighborhood: recipient.neighborhood,
      city: recipient.city,
      state: recipient.state,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }
  }
}
