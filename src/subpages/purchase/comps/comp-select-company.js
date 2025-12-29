/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
