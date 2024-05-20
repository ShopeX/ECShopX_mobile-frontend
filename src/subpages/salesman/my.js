import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage,SpCell } from '@/components'
import CompTabbar from './comps/comp-tabbar'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import './my.scss'

const initialConfigState = {

}

const MyPage = () => {
  const [state, setState] = useImmer(initialConfigState)

  return (
    <SpPage className={classNames('page-my-index')}
    renderFooter={<CompTabbar/>}
    >
      <View className='my-content'>
      <View className='my-content-header'>
        <SpCell
          title='手机号'
          iconPrefix={'iconfont icon-shoujihao my-icon'}
          icon='icon'
          border
          value={13888888888}
        ></SpCell>
        <SpCell
          iconPrefix={'iconfont icon-id my-icon'}
          icon='icon'
          title='业务员编码'
          border
          value={343422}
        ></SpCell>
        <SpCell
          iconPrefix={'iconfont icon-yewuyuanxingming my-icon'}
          icon='icon'
          title='业务员姓名'
          value={'WecomID'}
          border
        ></SpCell>
        <SpCell
          iconPrefix={'iconfont icon-shilileixing my-icon'}
          icon='icon'
          title='业务员类型'
          value={'商家业务员'}
        ></SpCell>
      </View>
      <View className='my-content-btm'>
        <SpCell
          isLink
          title='用户服务协议'
          border
          onClick={() => {
            // Taro.navigateTo({
            //   url: '/subpages/auth/reg-rule?type=privacyAndregister'
            // })
          }}
        ></SpCell>
        <SpCell
          isLink
          title='隐私协议'
          onClick={() => {
            // Taro.navigateTo({
            //   url: '/subpages/auth/reg-rule?type=privacyAndregister'
            // })
          }}
        ></SpCell>
      </View>
      </View>
    </SpPage>
  )
}

MyPage.options = {
  addGlobalClass: true
}

export default MyPage
