import { Admin } from '@/domain/orders-control/enterprise/entities/admin'
import { DeliveryMan } from '@/domain/orders-control/enterprise/entities/delivery-man'
import { Recipient } from '@/domain/orders-control/enterprise/entities/recipient'

export type AuthRepositories =
  | 'adminsRepository'
  | 'deliveryMenRepository'
  | 'recipientsRepository'
export type AuthResponse = Admin | DeliveryMan | Recipient
