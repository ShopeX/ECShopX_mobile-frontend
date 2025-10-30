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
import React from 'react'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'

import './index.scss'

function SpSelect(props) {
  const { info = [], value = [], multiple = false, onChange = () => {} } = props

  // useEffect( () => {

  // }, [])

  const selectedSet = new Set(value)
  console.log('xxx', selectedSet)
  const handleClick = ({ id }) => {
    if (!selectedSet.has(id)) {
      if (!multiple) {
        selectedSet.clear()
      }
      selectedSet.add(id)
    } else {
      selectedSet.delete(id)
    }

    onChange([...selectedSet])
  }

  return (
    <View className='sp-select'>
      {info.map((item) => (
        <View
          className={classNames('select-item', {
            active: value.includes(item.id)
          })}
          key={`select-item__${item.id}`}
          onClick={handleClick.bind(this, item)}
        >
          {item.name}
        </View>
      ))}
    </View>
  )
}

SpSelect.options = {
  addGlobalClass: true
}

export default React.memo(SpSelect)
