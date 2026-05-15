/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { $t, useTranslation } from '@/i18n'
import './index.scss'
import SpImage from '../sp-image'
import SpSearch from '../sp-search'

/**
 * 企业购「当前企业」抬头（活动列表、内购首页等复用）
 * @param {string} [props.label] 不传则用 locale「当前企业」
 * @param {string} props.name 企业名称（JSDoc；实际展示以 Redux `curEnterpriseName` 为准）
 * @param {boolean} [props.showMore=true] 是否显示「更多活动」
 * @param {boolean} [props.showSearch=false] 是否显示默认样式搜索条（不读店铺装修接口）
 * @param {React.ReactNode} [props.rightExtra] 右侧自定义内容（如详情页提示文案）；传入时不再展示「更多活动」
 */
function SpPurchaseEnterpriseBar(props) {
  const { i18n } = useTranslation()
  const { label, showMore = true, showSearch = false, rightExtra } = props
  const { curEnterpriseName } = useSelector((state) => state.purchase)

  const displayLabel =
    label !== undefined && label !== null && label !== '' ? label : $t('e82bd691.907398')

  const searchInfo = useMemo(
    () => ({
      base: {},
      config: {
        placeholder: $t('35994bc0.e5f71f'),
        fixTop: false
      }
    }),
    [i18n.language]
  )

  return (
    <View className='sp-purchase-enterprise-bar'>
      <View className='sp-purchase-enterprise-bar__row'>
        <View className='sp-purchase-enterprise-bar__left'>
          <Text className='sp-purchase-enterprise-bar__label'>{displayLabel}</Text>
          <Text className='sp-purchase-enterprise-bar__name'>{curEnterpriseName || '—'}</Text>
        </View>
        {rightExtra != null && rightExtra !== false ? (
          <View className='sp-purchase-enterprise-bar__right-extra'>{rightExtra}</View>
        ) : (
          showMore && (
            <View
              className='sp-purchase-enterprise-bar__more'
              onClick={() => {
                Taro.reLaunch({ url: '/subpages/purchase/activity-list' })
              }}
            >
              <Text className='sp-purchase-enterprise-bar__more-text'>{$t('e82bd691.0d411b')}</Text>
              <SpImage
                src='fv_chevron_right.png'
                width={36}
                height={36}
                className='sp-purchase-enterprise-bar__more-icon'
                mode='widthFix'
              />
            </View>
          )
        )}
      </View>
      {showSearch && (
        <View className='sp-purchase-enterprise-bar__search'>
          <SpSearch info={searchInfo} />
        </View>
      )}
    </View>
  )
}

SpPurchaseEnterpriseBar.options = {
  addGlobalClass: true
}

export default SpPurchaseEnterpriseBar
