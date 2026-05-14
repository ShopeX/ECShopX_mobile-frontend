/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { View } from '@tarojs/components'
import { useTranslation, $t } from '@/i18n'
import './comp-bottomTip.scss'

function CompsBanner() {
  useTranslation()
  return <View className='end-text'>{$t('eedb793d.1b355b')}</View>
}

CompsBanner.options = {
  addGlobalClass: true
}

export default CompsBanner
