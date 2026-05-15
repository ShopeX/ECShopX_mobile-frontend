/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useDidShow } from '@tarojs/taro'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpPage, SpCell } from '@/components'
import { useTranslation, $t } from '@/i18n'
import api from '@/api'
import CompTabbar from './comps/comp-tabbar'
import './my.scss'

const initialConfigState = {
  information: {}
}

const MyPage = () => {
  useTranslation()
  const [state, setState] = useImmer(initialConfigState)
  const { information } = state

  useDidShow(() => {
    Taro.setNavigationBarTitle({
      title: $t('1734e75c.041759')
    })
  })

  useEffect(() => {
    feach()
  }, [])

  const feach = async () => {
    Taro.showLoading({
      title: $t('52004c64.f013ea'),
      icon: 'none'
    })
    const res = await api.salesman.promoterInfo()
    setState((draft) => {
      draft.information = res
    })
    Taro.hideLoading()
  }

  return (
    <SpPage className={classNames('page-my-index')} renderFooter={<CompTabbar />}>
      <View className='my-content'>
        <View className='my-content-header'>
          <SpCell
            title={$t('52004c64.8098e2')}
            iconPrefix='iconfont icon-shoujihao my-icon'
            icon='icon'
            border
            value={information.mobile}
          />
          <SpCell
            iconPrefix='iconfont icon-id my-icon'
            icon='icon'
            title={$t('52004c64.f3c781')}
            border
            value={information.promoter_id}
          />
          <SpCell
            iconPrefix='iconfont icon-yewuyuanxingming my-icon'
            icon='icon'
            title={$t('52004c64.511948')}
            value={information.username}
            border
          />
          <SpCell
            iconPrefix='iconfont icon-shilileixing my-icon'
            icon='icon'
            title={$t('52004c64.2421fd')}
            value={information.type_promoter}
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
    </SpPage>
  )
}

MyPage.options = {
  addGlobalClass: true
}

export default MyPage
