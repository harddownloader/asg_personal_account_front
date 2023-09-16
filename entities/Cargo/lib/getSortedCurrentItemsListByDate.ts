import { TCargosItems } from '@/entities/Cargo'

export type TSort = 'asc' | 'desc'

export const getSortedCurrentItemsListByDate = (list: TCargosItems, order: TSort) => {
  return list.sort((a, b) => {
    const firstDate = new Date(a.createdAt)
    const secondDate = new Date(b.createdAt)

    const condition = order === 'asc'
      ? firstDate > secondDate
      : firstDate < secondDate

    if (condition) {
      return -1
    } else if (firstDate == secondDate) {
      return 0
    } else {
      return 1
    }
  })
}
