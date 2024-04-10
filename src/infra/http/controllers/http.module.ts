import { Module } from '@nestjs/common'

import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { AuthenticateUseCase } from '@/domain/orders-control/application/use-cases/authenticate'
import { ChangeOrderStatusUseCase } from '@/domain/orders-control/application/use-cases/change-order-status'
import { ChangePasswordUseCase } from '@/domain/orders-control/application/use-cases/change-password'
import { CreateAddressUseCase } from '@/domain/orders-control/application/use-cases/create-address'
import { CreateAdminUseCase } from '@/domain/orders-control/application/use-cases/create-admin'
import { CreateDeliveryManUseCase } from '@/domain/orders-control/application/use-cases/create-delivery-man'
import { CreateOrderUseCase } from '@/domain/orders-control/application/use-cases/create-order'
import { CreateRecipientUseCase } from '@/domain/orders-control/application/use-cases/create-recipient'
import { DeleteAddressUseCase } from '@/domain/orders-control/application/use-cases/delete-address'
import { DeleteDeliveryManUseCase } from '@/domain/orders-control/application/use-cases/delete-delivery-man'
import { DeleteOrderUseCase } from '@/domain/orders-control/application/use-cases/delete-order'
import { DeleteRecipientUseCase } from '@/domain/orders-control/application/use-cases/delete-recipient'
import { EditAddressUseCase } from '@/domain/orders-control/application/use-cases/edit-address'
import { EditDeliveryManUseCase } from '@/domain/orders-control/application/use-cases/edit-delivery-man'
import { EditOrderUseCase } from '@/domain/orders-control/application/use-cases/edit-order'
import { EditRecipientUseCase } from '@/domain/orders-control/application/use-cases/edit-recipient'
import { FetchDeliveryMenUseCase } from '@/domain/orders-control/application/use-cases/fetch-delivery-men'
import { FetchOrdersUseCase } from '@/domain/orders-control/application/use-cases/fetch-orders'
import { FetchOrdersByDeliveryManUseCase } from '@/domain/orders-control/application/use-cases/fetch-orders-by-delivery-man'
import { FetchOrdersNearByDeliveryManUseCase } from '@/domain/orders-control/application/use-cases/fetch-orders-near-by-delivery-man'
import { FetchRecipientsUseCase } from '@/domain/orders-control/application/use-cases/fetch-recipients'
import { SaveOrderAttachmentUseCase } from '@/domain/orders-control/application/use-cases/save-order-attachment'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { HashModule } from '@/infra/hash/hash.module'
import { StorageModule } from '@/infra/storage/storage.module'

import { AuthenticateController } from './authenticate.controller'
import { ChangeOrderStatusController } from './change-order-status.controller'
import { ChangePasswordController } from './change-password.controller'
import { CreateAddressController } from './create-address.controller'
import { CreateOrderController } from './create-order.controller'
import { CreateRecipientController } from './create-recipient.controller'
import { CreateUserController } from './create-user.controller'
import { DeleteAddressController } from './delete-address.controller'
import { DeleteDeliveryManController } from './delete-delivery-man.controller'
import { DeleteOrderController } from './delete-order.controller'
import { DeleteRecipientController } from './delete-recipient.controller'
import { EditAddressController } from './edit-address.controller'
import { EditDeliveryManController } from './edit-delivery-man.controller'
import { EditOrderController } from './edit-order.controller'
import { EditRecipientController } from './edit-recipient.controller'
import { FetchDeliveryMenController } from './fetch-delivery-men.controller'
import { FetchOrdersController } from './fetch-orders.controller'
import { FetchOrdersByDeliveryManController } from './fetch-orders-by-delivery-man.controller'
import { FetchOrdersNearByDeliveryManController } from './fetch-orders-near-by-delivery-man.controller'
import { FetchRecipientsController } from './fetch-recipients.controller'
import { ReadNotificationController } from './read-notification.controller'
import { SaveOrderAttachmentController } from './save-order-attachment.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, HashModule, StorageModule],
  controllers: [
    AuthenticateController,
    CreateUserController,
    FetchDeliveryMenController,
    EditDeliveryManController,
    DeleteDeliveryManController,
    CreateOrderController,
    EditOrderController,
    DeleteOrderController,
    FetchOrdersController,
    CreateRecipientController,
    EditRecipientController,
    DeleteRecipientController,
    FetchRecipientsController,
    ChangeOrderStatusController,
    SaveOrderAttachmentController,
    FetchOrdersNearByDeliveryManController,
    FetchOrdersByDeliveryManController,
    ChangePasswordController,
    ReadNotificationController,
    CreateAddressController,
    EditAddressController,
    DeleteAddressController,
  ],
  providers: [
    AuthenticateUseCase,
    CreateAdminUseCase,
    CreateDeliveryManUseCase,
    FetchDeliveryMenUseCase,
    EditDeliveryManUseCase,
    DeleteDeliveryManUseCase,
    CreateOrderUseCase,
    EditOrderUseCase,
    DeleteOrderUseCase,
    FetchOrdersUseCase,
    CreateRecipientUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
    FetchRecipientsUseCase,
    ChangeOrderStatusUseCase,
    SaveOrderAttachmentUseCase,
    FetchOrdersNearByDeliveryManUseCase,
    FetchOrdersByDeliveryManUseCase,
    ChangePasswordUseCase,
    ReadNotificationUseCase,
    CreateAddressUseCase,
    EditAddressUseCase,
    DeleteAddressUseCase,
  ],
  exports: [
    AuthenticateUseCase,
    CreateAdminUseCase,
    CreateDeliveryManUseCase,
    FetchDeliveryMenUseCase,
    EditDeliveryManUseCase,
    DeleteDeliveryManUseCase,
    CreateOrderUseCase,
    EditOrderUseCase,
    DeleteOrderUseCase,
    FetchOrdersUseCase,
    CreateRecipientUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
    FetchRecipientsUseCase,
    ChangeOrderStatusUseCase,
    SaveOrderAttachmentUseCase,
    FetchOrdersNearByDeliveryManUseCase,
    FetchOrdersByDeliveryManUseCase,
    ChangePasswordUseCase,
    ReadNotificationUseCase,
    CreateAddressUseCase,
    EditAddressUseCase,
    DeleteAddressUseCase,
  ],
})
export class HttpModule {}
