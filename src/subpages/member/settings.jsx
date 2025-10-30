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
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { SpPage, SpCell, SpFloatLayout, SpCheckbox } from '@/components'
import { isWeb } from '@/utils'
import { SG_CHECK_STORE_RULE } from '@/consts'
import { View } from '@tarojs/components'
import i18n from '@/lang/consts'
import './settings.scss'

const initialState = {
  showSwitchLanguage: false,
  selectLang: '',
  languageList: []
}

const Settings = () => {
  const [state, setState] = useImmer(initialState)
  const lang = Taro.getStorageSync('lang')
  console.log('lang', lang, 'i18n', i18n)

  useEffect(() => {
    // 初始化语言列表
    setState((draft) => {
      draft.languageList = Object.keys(i18n).map((key) => {
        return {
          name: i18n[key],
          key,
          ischecked: key === lang
        }
      })
      draft.selectLang = lang
    })
  }, [])

  return (
    <SpPage className='sp-settings'>
      <View className='block-container'>
        <SpCell
          isLink
          title='切换语言'
          value={i18n[lang]}
          onClick={() => {
            setState((draft) => {
              draft.selectLang = lang
              draft.showSwitchLanguage = true
            })
          }}
        ></SpCell>
      </View>

      {/* 切换语言弹窗 */}
      <SpFloatLayout
        title='切换语言'
        open={state.showSwitchLanguage}
        onClose={() => {
          setState((draft) => {
            draft.showSwitchLanguage = false
          })
        }}
        renderFooter={
          <AtButton
            circle
            type='primary'
            onClick={() => {
              Taro.$changeLang(state.selectLang)
              Taro.setStorageSync(SG_CHECK_STORE_RULE, 0)
              if (isWeb) {
                window.location.href = `${window.location.origin}/subpages/member/index`
              } else {
                Taro.reLaunch({
                  url: '/subpages/member/index'
                })
              }
            }}
          >
            确定
          </AtButton>
        }
      >
        <View className='lang-list'>
          {state.languageList.map((item, index) => (
            <View className='lang-item' key={`lang-item__${index}`}>
              <SpCheckbox
                checked={item.key == state.selectLang}
                onChange={(e) => {
                  setState((draft) => {
                    draft.selectLang = item.key
                  })
                }}
              >
                {item.name}
              </SpCheckbox>
            </View>
          ))}
        </View>
      </SpFloatLayout>
    </SpPage>
  )
}

export default Settings
