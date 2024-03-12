import { Admin } from '@/domain/orders-control/enterprise/entities/admin'
import { DeliveryMan } from '@/domain/orders-control/enterprise/entities/delivery-man'

export type AuthRepositories = 'adminsRepository' | 'deliveryMenRepository'
export type AuthResponse = Admin | DeliveryMan
