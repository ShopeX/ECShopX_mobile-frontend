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
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View } from '@tarojs/components'
import { SpPrice, SpFloatLayout } from '@/components'
import classNames from 'classnames'
import './comp-select-company.scss'

function CompSelectCompany(props) {
  const {
    isOpened,
    list = [],
    curIndex,
    onClose = () => {},
    onConfirm = () => {},
    handleItemClick = () => {},
    children
  } = props

  return (
    <SpFloatLayout
      title='选择企业'
      className='comp-select-company'
      open={isOpened}
      onClose={onClose}
      renderFooter={
        <AtButton circle type='primary' onClick={onConfirm}>
          确定
        </AtButton>
      }
    >
      <View>
        {list.map((item, index) => (
          <View
            className={classNames('company-item', { 'company-item-acyive': index === curIndex })}
            onClick={() => handleItemClick(index)}
            key={`company-item__${index}`}
          >
            {item.enterprise_name}
          </View>
        ))}
      </View>
    </SpFloatLayout>
  )
}

CompSelectCompany.options = {
  addGlobalClass: true
}

export default CompSelectCompany
