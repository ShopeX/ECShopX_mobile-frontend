/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames, formatTime } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import './comp-evaluation.scss'

function getDisplayName(item) {
  if (item.anonymous) {
    return $t('72c4b1f1.708229')
  }
  const name = item.username || $t('72c4b1f1.708229')
  const chars = Array.from(String(name))
  if (!chars.length) {
    return $t('72c4b1f1.708229')
  }
  return `${chars[0]}****`
}

function getAvatarLetter(item) {
  if (item.anonymous) {
    return Array.from($t('72c4b1f1.708229'))[0] || 'A'
  }
  const name = item.username || $t('72c4b1f1.708229')
  const first = Array.from(String(name))[0] || 'A'
  return /[a-z]/i.test(first) ? first.toUpperCase() : first
}

function getRateDate(item) {
  const raw = item.created || item.created_time || item.rate_time
  if (!raw) {
    return ''
  }
  try {
    return formatTime(raw, 'YYYY-MM')
  } catch (e) {
    return ''
  }
}

function CompEvaluation(props) {
  useTranslation()
  const { className, allNum, list = [], itemId } = props

  const onViewMore = () => {
    if (!list.length) {
      return
    }
    Taro.navigateTo({
      url: `/marketing/pages/item/espier-evaluation?id=${itemId}`
    })
  }

  const isEmpty = !list.length

  return (
    <View className={classNames('comp-evaluation', className)} onClick={onViewMore}>
      <View className='evaluation-hd'>
        <View className='title'>{ti('72c4b1f1.0c834e', [allNum || 0])}</View>
      </View>
      <View className={classNames('evaluation-bd', isEmpty ? 'evaluation-bd--empty' : 'evaluation-bd--list')}>
        {list.map((item) => (
          <View className='evaluation-item-wrap' key={item.rate_id || item.username}>
            <View className='item-hd'>
              <View className='evaluation-avatar'>
                <Text className='evaluation-avatar__letter'>{getAvatarLetter(item)}</Text>
              </View>
              <Text className='evaluation-name'>{getDisplayName(item)}</Text>
              <Text className='evaluation-date'>{getRateDate(item)}</Text>
            </View>
            {!!item.content && (
              <View className='evaluation-content'>{item.content}</View>
            )}
          </View>
        ))}
        {isEmpty && <View className='default-msg'>{$t('72c4b1f1.5a8497')}</View>}
      </View>
    </View>
  )
}

CompEvaluation.options = {
  addGlobalClass: true
}

export default CompEvaluation
