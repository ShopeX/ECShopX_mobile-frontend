/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { View, Image } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import SpPage from '@/components/sp-page'
import { useImmer } from 'use-immer'
import './view-case.scss'

const initialState = {
  designWorks: []
}

function ViewCase() {
  const [state, setState] = useImmer(initialState)
  const { designWorks } = state
  const $instance = getCurrentInstance()
  const { design_works } = $instance.router?.params || {}
  useEffect(() => {
    if (design_works) {
      const designWorksList = JSON.parse(design_works)
      setState((draft) => {
        draft.designWorks = designWorksList
      })
    }
  }, [])
  const handleNavtoDetail = (item) => {
    const { design_id, plan_id } = item
    Taro.navigateTo({
      url: `/subpages/case/detail?design_id=${design_id}&plan_id=${plan_id}`
    })
  }

  return (
    <View className='sp-case-list'>
      <SpPage>
        <View className='sp-case-list--wrap'>
          <View className='sp-case-list--right'>
            {designWorks.map((item) => {
              return (
                <View
                  className='sp-case-list--item'
                  key={item.design_id}
                  onClick={() => handleNavtoDetail(item)}
                >
                  <Image
                    lazyLoad
                    className='sp-case-list--item-image'
                    mode='widthFix'
                    src={item.cover_pic}
                  ></Image>
                  <View className='sp-case-list--item-desc'>
                    <View className='sp-case-list--item-desc-title'>{item.design_name}</View>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </SpPage>
    </View>
  )
}

export default ViewCase
