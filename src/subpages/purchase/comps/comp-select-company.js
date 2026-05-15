/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { AtButton } from 'taro-ui'
import { View } from '@tarojs/components'
import { SpFloatLayout } from '@/components'
import classNames from 'classnames'
import { useTranslation, $t } from '@/i18n'
import './comp-select-company.scss'

function CompSelectCompany(props) {
  useTranslation()
  const {
    isOpened,
    list = [],
    curIndex,
    onClose = () => {},
    onConfirm = () => {},
    handleItemClick = () => {}
  } = props

  return (
    <SpFloatLayout
      title={$t('8cad8bc2.0067d7')}
      className='comp-select-company'
      open={isOpened}
      onClose={onClose}
      renderFooter={
        <AtButton circle type='primary' onClick={onConfirm}>
          {$t('8cad8bc2.38cf16')}
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
