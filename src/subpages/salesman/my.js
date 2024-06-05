import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpPage, SpCell } from '@/components'
import api from '@/api'
import CompTabbar from './comps/comp-tabbar'
import './my.scss'

const initialConfigState = {
  information: {}
}

const MyPage = () => {
  const [state, setState] = useImmer(initialConfigState)
  const { information } = state

  useEffect(() => {
    // 获取个人信息
    feach()
  }, [])

  const feach = async () => {
    Taro.showLoading({
      title: '加载中',
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
            title='手机号'
            iconPrefix='iconfont icon-shoujihao my-icon'
            icon='icon'
            border
            value={information.mobile}
          />
          <SpCell
            iconPrefix='iconfont icon-id my-icon'
            icon='icon'
            title='业务员编码'
            border
            value={information.promoter_id}
          />
          <SpCell
            iconPrefix='iconfont icon-yewuyuanxingming my-icon'
            icon='icon'
            title='业务员姓名'
            value={information.username}
            border
          />
          <SpCell
            iconPrefix='iconfont icon-shilileixing my-icon'
            icon='icon'
            title='业务员类型'
            value={information.type_promoter}
          />
        </View>
        <View className='my-content-btm'>
          <SpCell
            isLink
            title='用户服务协议'
            border
            onClick={() => {
              Taro.navigateTo({
                url: '/subpages/auth/reg-rule?type=privacyAndregister'
              })
            }}
          />
          <SpCell
            isLink
            title='隐私协议'
            onClick={() => {
              Taro.navigateTo({
                url: '/subpages/auth/reg-rule?type=privacyAndregister'
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
