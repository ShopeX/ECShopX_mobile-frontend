// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
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

export const CATEGORY_STORE_LIST_TWO_CHILDREN = {
  name: 'name',
  children: ({ children }) => {
    return pickBy(children, {
      name: 'name',
      img: 'img',
      category_id: 'category_id',
      main_category_id: 'main_category_id',
      is_main_category: 'is_main_category'
    })
  }
}
