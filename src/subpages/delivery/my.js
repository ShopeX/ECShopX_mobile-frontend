import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpPage, SpCell } from '@/components'
import { useSelector } from 'react-redux'
import api from '@/api'
import { AtNoticebar } from 'taro-ui'
import CompTabbar from './comps/comp-tabbar'
import './my.scss'

const initialConfigState = {
  information: {}
}

const MyPage = () => {
  const [state, setState] = useImmer(initialConfigState)
  const { information } = state
  const { deliveryPersonnel } = useSelector((state) => state.cart)

  useEffect(() => {
    // 获取个人信息
    feach()
  }, [])

  const feach = async () => {
    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })
    const res = await api.delivery.selfdeliveryList({ ...deliveryPersonnel })
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
              title='手机号'
              iconPrefix='iconfont icon-shoujihao my-icon'
              icon='icon'
              border
              value={information.mobile}
            />
            <SpCell
              iconPrefix='iconfont icon-id my-icon'
              icon='icon'
              title='配送员编码'
              border
              value={information.operator_id}
            />
            <SpCell
              iconPrefix='iconfont icon-yewuyuanxingming my-icon'
              icon='icon'
              title='配送员姓名'
              value={information.username}
              border
            />
            <SpCell
              iconPrefix='iconfont icon-shilileixing my-icon'
              icon='icon'
              title='配送员类型'
              value={information.staff_attribute === 'full_time' ? '全职' : '兼职'}
            />
          </View>
          <View className='my-content-btm'>
            <SpCell
              isLink
              title='用户服务协议'
              border
              onClick={() => {
                Taro.navigateTo({
                  url: '/subpages/auth/reg-rule?type=x'
                })
              }}
            />
            <SpCell
              isLink
              title='隐私协议'
              onClick={() => {
                Taro.navigateTo({
                  url: '/subpages/auth/reg-rule?type=y'
                })
              }}
            />
          </View>
        </View>
      ) : (
        <AtNoticebar marquee>请先去配送员首页选择店铺哟</AtNoticebar>
      )}
    </SpPage>
  )
}

MyPage.options = {
  addGlobalClass: true
}

export default MyPage
