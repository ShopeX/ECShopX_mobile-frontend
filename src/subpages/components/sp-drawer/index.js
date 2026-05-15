/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View, ScrollView } from '@tarojs/components'
import { AtDrawer } from 'taro-ui'
import { SpButton } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './index.scss'

const voidFn = () => {}

function SpDrawer(props) {
  const { show, onClose = voidFn, children, onReset = voidFn, onConfirm = voidFn } = props
  return (
    <AtDrawer className='sp-drawer' show={show} right mask onClose={onClose} width='260px'>
      <ScrollView className='sp-drawer__body' scrollY>
        {children}
      </ScrollView>
      <View className='sp-drawer__footer'>
        <SpButton
          resetText={$t('49677bca.4b9c32')}
          confirmText={$t('49677bca.c7995a')}
          onConfirm={onConfirm}
          onReset={onReset}
        ></SpButton>
      </View>
    </AtDrawer>
  )
}

export default SpDrawer
