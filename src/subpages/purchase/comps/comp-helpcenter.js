/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { View, Button, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import './comp-helpcenter.scss'

const MENUS = [
  // { key: 'share', name: '我要分享', icon: 'icon-fenxiang-01' },
  {
    key: 'address',
    nameKey: 'aef62b39.bca1ea',
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
    nameKey: 'aef62b39.f7d65e',
    icon: 'icon-xieyiyuzhengce-01',
    link: '/subpages/auth/reg-rule?type=privacyAndregister'
  }
]

function CompHelpCenter(props) {
  useTranslation()
  const { onLink = () => {} } = props
  return (
    <View className='comp-help-center'>
      {MENUS.map((item, index) => (
        <View className='menu-item' key={`menu-item__${index}`}>
          {item.key == 'share' && (
            <Button className='btn-share' open-type='share'>
              <Text className={classNames('iconfont', item.icon)}></Text>
              <Text className='menu-name'>{$t(item.nameKey)}</Text>
            </Button>
          )}
          {item.key !== 'share' && (
            <View className='item-wrap' onClick={onLink.bind(this, item)}>
              <Text className={classNames('iconfont', item.icon)}></Text>
              <Text className='menu-name'>{$t(item.nameKey)}</Text>
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
