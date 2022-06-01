import { pickBy } from '@/utils'

export const CATEGORY_LIST = {
  name: 'name',
  img: 'img',
  children: 'children',
  hot: 'hot',
  id: 'id'
}

export const CATEGORY_STORE_LIST = {
  name: 'name',
  children: ({ children }) => {
    return pickBy(children, {
      name: 'name',
      img: 'img',
      children: ({ children }) => {
        return pickBy(children, {
          name: 'name',
          img: 'img',
          category_id: 'category_id',
          main_category_id: 'main_category_id',
          is_main_category: 'is_main_category'
        })
      }
    })
  }
}
