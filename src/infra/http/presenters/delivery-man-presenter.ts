import { DeliveryMan } from '@/domain/orders-control/enterprise/entities/delivery-man'

export class DeliveryManPresenter {
  static toHTTP(deliveryMan: DeliveryMan) {
    return {
      id: deliveryMan.id.toString(),
      name: deliveryMan.name,
      individualRegistration: deliveryMan.individualRegistration.value,
      cellphone: deliveryMan.cellphone.value,
      createdAt: deliveryMan.createdAt,
      updatedAt: deliveryMan.updatedAt,
    }
  }
}
