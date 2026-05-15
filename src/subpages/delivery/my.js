/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import { SpPage, SpCell } from '@/components'
import { useSelector } from 'react-redux'
import * as deliveryApi from '@/api/delivery'
import { AtNoticebar } from 'taro-ui'
import CompTabbar from './comps/comp-tabbar'
import './my.scss'

const initialConfigState = {
  information: {}
}

const MyPage = () => {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialConfigState)
  const { information } = state
  const { deliveryPersonnel } = useSelector((state) => state.cart)

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('dc7a114e.041759') })
  }, [i18n.language])

  useEffect(() => {
    // 获取个人信息
    feach()
  }, [])

  const feach = async () => {
    Taro.showLoading({
      title: $t('ac21eb4c.f013ea'),
      icon: 'none'
    })
    const res = await deliveryApi.selfdeliveryList({ ...deliveryPersonnel })
    setState((draft) => {
      draft.information = res.list[0]
    })
    Taro.hideLoading()
  }

  return (
    <SpPage className={classNames('page-my-index')} renderFooter={<CompTabbar />}>
      {deliveryPersonnel.distributor_id ? (
        <View className='my-content'>
          <View className='my-content-header'>
            <SpCell
              title={$t('ed3eeaa3.8098e2')}
              iconPrefix='iconfont icon-shoujihao my-icon'
              icon='icon'
              border
              value={information.mobile}
            />
            <SpCell
              iconPrefix='iconfont icon-id my-icon'
              icon='icon'
              title={$t('ed3eeaa3.530880')}
              border
              value={information.operator_id}
            />
            <SpCell
              iconPrefix='iconfont icon-yewuyuanxingming my-icon'
              icon='icon'
              title={$t('ed3eeaa3.9b3489')}
              value={information.username}
              border
            />
            <SpCell
              iconPrefix='iconfont icon-shilileixing my-icon'
              icon='icon'
              title={$t('ed3eeaa3.04dbf8')}
              value={
                information.staff_attribute === 'full_time'
                  ? $t('ed3eeaa3.63f85b')
                  : $t('ed3eeaa3.7c4f46')
              }
            />
          </View>
          <View className='my-content-btm'>
            <SpCell
              isLink
              title={$t('52004c64.1c1926')}
              border
              onClick={() => {
                Taro.navigateTo({
                  url: '/subpages/auth/reg-rule?type=x'
                })
              }}
            />
            <SpCell
              isLink
              title={$t('52004c64.b0d560')}
              onClick={() => {
                Taro.navigateTo({
                  url: '/subpages/auth/reg-rule?type=y'
                })
              }}
            />
          </View>
        </View>
      ) : (
        <AtNoticebar marquee>{$t('ed3eeaa3.c0136f')}</AtNoticebar>
      )}
    </SpPage>
  )
}

MyPage.options = {
  addGlobalClass: true
}

export default MyPage
