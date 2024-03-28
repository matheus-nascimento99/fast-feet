import { WatchedList } from '@/core/entities/watched-list'

import { Address } from './address'

export class AddressList extends WatchedList<Address> {
  compareItems(a: Address, b: Address): boolean {
    return a.equals(b)
  }
}
