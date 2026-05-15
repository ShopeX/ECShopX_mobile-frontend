/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { ScrollView, View } from '@tarojs/components'
import { SpPage, SpHtml } from '@/components'
import { classNames } from '@/utils'
import { useState, useEffect } from 'react'
import * as merchantApi from '@/api/merchant'
import { useTranslation, $t } from '@/i18n'
import { MNavBar } from './comps'
import './agreement.scss'

const Agreement = () => {
  useTranslation()
  const [content, setContent] = useState('')

  const getContent = async () => {
    const { content } = await merchantApi.getSetting()
    setContent(content)
  }

  useEffect(() => {
    getContent()
  }, [])

  return (
    <SpPage className={classNames('page-merchant-agreement')} navbar={false}>
      <MNavBar canLogout={false} />

      <ScrollView className='page-merchant-agreement-content' scrollY>
        <View className='title'>{$t('0f7130d3.ef012e')}</View>

        <SpHtml content={content} />
      </ScrollView>
    </SpPage>
  )
}

export default Agreement
