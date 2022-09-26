import Taro from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpLogin } from '@/components'
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
  // {
  //   key: 'poolicy',
  //   name: '隐私与政策',
  //   icon: 'icon-xieyiyuzhengce-01',
  //   link: '/subpages/auth/reg-rule?type=privacyAndregister'
  // }
]

function CompHelpCenter(props) {
  const { onLink = () => {} } = props
  return (
    <View className='comp-help-center'>
      {MENUS.map((item, index) => (
        <SpLogin
          className='menu-item'
          key={`menu-item__${index}`}
          onChange={onLink.bind(this, item)}
        >
          {/* {item.key == 'share' && (
            <Button className='btn-share' open-type='share'>
              <Text className={classNames('iconfont', item.icon)}></Text>
              <Text className='menu-name'>{item.name}</Text>
            </Button>
          )} */}
          {/* {item.key !== 'share' && ( */}
          <View className='item-wrap'>
            <Text className={classNames('iconfont', item.icon)}></Text>
            <Text className='menu-name'>{item.name}</Text>
          </View>
          {/* )} */}
        </SpLogin>
      ))}
    </View>
  )
}

CompHelpCenter.options = {
  addGlobalClass: true
}

export default CompHelpCenter
