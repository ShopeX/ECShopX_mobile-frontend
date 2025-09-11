import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { SpPage, SpCell, SpFloatLayout, SpCheckbox } from '@/components'
import { isWeb } from '@/utils'
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
