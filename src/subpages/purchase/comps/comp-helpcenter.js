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
import Taro from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage } from '@/components'
import { classNames, styleNames } from '@/utils'

import './comp-helpcenter.scss'

const MENUS = [
  // { key: 'share', name: '我要分享', icon: 'icon-fenxiang-01' },
  {
    key: 'address',
    name: '地址管理',
    icon: 'icon-dizhiguanli-01',
    link: '/marketing/pages/member/address'
  },
  // {
  //   key: 'useinfo',
  //   name: '设置',
  //   icon: 'icon-gerenxinxi-01',
  //   link: '/marketing/pages/member/member-setting'
  // },
  {
    key: 'poolicy',
    name: '隐私与政策',
    icon: 'icon-xieyiyuzhengce-01',
    link: '/subpages/auth/reg-rule?type=privacyAndregister'
  }
]

function CompHelpCenter(props) {
  const { onLink = () => {} } = props
  return (
    <View className='comp-help-center'>
      {MENUS.map((item, index) => (
        <View className='menu-item' key={`menu-item__${index}`}>
          {item.key == 'share' && (
            <Button className='btn-share' open-type='share'>
              <Text className={classNames('iconfont', item.icon)}></Text>
              <Text className='menu-name'>{item.name}</Text>
            </Button>
          )}
          {item.key !== 'share' && (
            <View className='item-wrap' onClick={onLink.bind(this, item)}>
              <Text className={classNames('iconfont', item.icon)}></Text>
              <Text className='menu-name'>{item.name}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  )
}

CompHelpCenter.options = {
  addGlobalClass: true
}

export default CompHelpCenter
