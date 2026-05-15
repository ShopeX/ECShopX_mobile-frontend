/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPrice, SpFloatLayout, SpCheckboxNew, SpGoodsCell } from '@/components'
import { useTranslation, $t } from '@/i18n'
import './comp-packagelist.scss'

function CompPackageList(props) {
  useTranslation()
  const { open = false, info, onClose } = props
  if (!info) {
    return null
  }
  const { mainGoods, makeUpGoods } = info

  // useEffect(() => {
  //   fetch()
  // }, [])

  // const fetch = async () =>{
  //   const { itemLists, mainItem, main_package_price, package_price: packagePrice } = await api.item.packageDetail(info.package_id)
  // }
  const handleAddCart = () => {}

  return (
    <SpFloatLayout
      className='comp-packagelist'
      title={$t('16ba0139.f4fb0d')}
      open={open}
      onClose={onClose}
      renderFooter={
        <View className='flay-ft'>
          <View>
            {$t('16ba0139.b8a3db')}
            <SpPrice value={100} />
          </View>
          <View className='btn-wrap'>
            <AtButton type='primary' circle onClick={handleAddCart}>
              {$t('16ba0139.62d369')}
            </AtButton>
          </View>
        </View>
      }
    >
      <View className='main-goods'>{$t('16ba0139.91b4c9')}</View>
      <View className='main-goods-list'>
        <View className='main-goods-item'>
          <SpGoodsCell info={mainGoods} />
        </View>
      </View>
      <View className='makeup-goods'>{$t('16ba0139.809ab0')}</View>
      <View className='makeup-goods-list'>
        {makeUpGoods.map((item, index) => (
          <View className='makeup-goods-item'>
            <SpCheckboxNew />
            <SpGoodsCell info={item} />
          </View>
        ))}
      </View>
    </SpFloatLayout>
  )
}

CompPackageList.options = {
  addGlobalClass: true
}

export default CompPackageList
