import { Module } from '@nestjs/common'

import { AuthenticateUseCase } from '@/domain/orders-control/application/use-cases/authenticate'
import { CreateAdminUseCase } from '@/domain/orders-control/application/use-cases/create-admin'
import { CreateDeliveryManUseCase } from '@/domain/orders-control/application/use-cases/create-delivery-man'
import { CreateOrderUseCase } from '@/domain/orders-control/application/use-cases/create-order'
import { CreateRecipientUseCase } from '@/domain/orders-control/application/use-cases/create-recipient'
import { DeleteDeliveryManUseCase } from '@/domain/orders-control/application/use-cases/delete-delivery-man'
import { DeleteOrderUseCase } from '@/domain/orders-control/application/use-cases/delete-order'
import { DeleteRecipientUseCase } from '@/domain/orders-control/application/use-cases/delete-recipient'
import { EditDeliveryManUseCase } from '@/domain/orders-control/application/use-cases/edit-delivery-man'
import { EditOrderUseCase } from '@/domain/orders-control/application/use-cases/edit-order'
import { EditRecipientUseCase } from '@/domain/orders-control/application/use-cases/edit-recipient'
import { FetchDeliveryMenUseCase } from '@/domain/orders-control/application/use-cases/fetch-delivery-men'
import { FetchOrdersUseCase } from '@/domain/orders-control/application/use-cases/fetch-orders'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { HashModule } from '@/infra/hash/hash.module'

import { AuthenticateController } from './authenticate.controller'
import { CreateOrderController } from './create-order.controller'
import { CreateRecipientController } from './create-recipient.controller'
import { CreateUserController } from './create-user.controller'
import { DeleteDeliveryManController } from './delete-delivery-man.controller'
import { DeleteOrderController } from './delete-order.controller'
import { DeleteRecipientController } from './delete-recipient.controller'
import { EditDeliveryManController } from './edit-delivery-man.controller'
import { EditOrderController } from './edit-order.controller'
import { EditRecipientController } from './edit-recipient.controller'
import { FetchDeliveryMenController } from './fetch-delivery-men.controller'
import { FetchOrdersController } from './fetch-orders.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, HashModule],
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
  ],
})
export class HttpModule {}
