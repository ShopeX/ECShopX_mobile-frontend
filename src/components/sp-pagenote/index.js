/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React from 'react'
import { View } from '@tarojs/components'
import { classNames } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import SpLoading from '../sp-loading'
import SpNote from '../sp-note'

import './index.scss'

function SpPageNote(props) {
  useTranslation()
  const { info: page, className, title, button, value, btnText, to } = props
  if (!page) {
    return null
  }
  return (
    <View className={classNames('sp-page-note', className)}>
      {page.isLoading && <SpLoading>{$t('eb9a3a24.bd0271')}</SpLoading>}
      {page.done && page.total == 0 && (
        <SpNote icon title={$t('eb9a3a24.f1f45e')} button btnText={$t('eb9a3a24.678df9')} to={to} />
      )}
      {!page.isLoading && !page.hasNext && page.total > 0 && (
        <SpNote className='no-more' title={$t('eb9a3a24.a25652')}></SpNote>
      )}
    </View>
  )
}

SpPageNote.defaultProps = {
  info: null,
  to: ''
}

SpPageNote.options = {
  addGlobalClass: true
}

export default SpPageNote
