/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { SpPage, SpCell, SpFloatLayout, SpCheckbox } from '@/components'
import { isWeb } from '@/utils'
import { SG_CHECK_STORE_RULE } from '@/consts'
import { View } from '@tarojs/components'
import {
  useTranslation,
  $t,
  syncI18nLanguage,
  normalizeStorageLang,
  SUPPORTED_STORAGE_LANGS
} from '@/i18n'
import './settings.scss'

const initialState = {
  showSwitchLanguage: false,
  selectLang: '',
  languageList: []
}

const Settings = () => {
  const { i18n } = useTranslation()
  const [state, setState] = useImmer(initialState)
  const lang =
    normalizeStorageLang(Taro.getStorageSync('lang')) ||
    normalizeStorageLang(process.env.APP_DEFAULT_LANGUAGE) ||
    'en'

  useEffect(() => {
    setState((draft) => {
      draft.languageList = SUPPORTED_STORAGE_LANGS.map((key) => ({
        key,
        name: $t(`lang.name.${key}`),
        ischecked: key === lang
      }))
      draft.selectLang = lang
    })
  }, [lang, setState])

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: $t('162d72a5.e366cc')
    })
  }, [i18n.language])

  return (
    <SpPage className='sp-settings'>
      <View className='block-container'>
        <SpCell
          isLink
          title={$t('settings.switchLanguage')}
          value={$t(`lang.name.${lang}`)}
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
        title={$t('settings.switchLanguage')}
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
            onClick={async () => {
              Taro.$changeLang(state.selectLang)
              await syncI18nLanguage(state.selectLang)
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
            {$t('settings.confirm')}
          </AtButton>
        }
      >
        <View className='lang-list'>
          {state.languageList.map((item, index) => (
            <View
              className='lang-item'
              key={`lang-item__${index}`}
              onClick={() => {
                setState((draft) => {
                  draft.selectLang = item.key
                })
              }}
            >
              <SpCheckbox
                checked={item.key === state.selectLang}
                canCancel={item.key === state.selectLang}
                onChange={(checked) => {
                  if (checked) {
                    setState((draft) => {
                      draft.selectLang = item.key
                    })
                  }
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
