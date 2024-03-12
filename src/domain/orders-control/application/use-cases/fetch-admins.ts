/* eslint-disable @typescript-eslint/no-empty-interface */
import { Either, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'

import { Admin } from '../../enterprise/entities/admin'
import { AdminsRepository } from '../repositories/admin'

type FetchAdminsUseCaseRequest = PaginationParams

type FetchAdminsUseCaseResponse = Either<
  {
    items: Admin[]
  },
  null
>

export class FetchAdminsUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    page,
    limit,
  }: FetchAdminsUseCaseRequest): Promise<FetchAdminsUseCaseResponse> {
    const admins = await this.adminsRepository.findMany({
      page,
      limit,
    })

    return right({
      items: admins,
    })
  }
}
