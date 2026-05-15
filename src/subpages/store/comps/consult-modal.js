/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { classNames } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'

import './consult-modal.scss'

/**
 * 联系顾问弹框组件（布局对齐 Popup 企微弹窗 qiwei-wechat-content）
 * @param {boolean} visible - 是否显示弹框
 * @param {string} type - 弹框类型：'1'-门店二维码，'2'-导购二维码
 * @param {object} data - 弹框数据
 * @param {function} onClose - 关闭弹框回调
 */
function ConsultModal({ visible, type, data, onClose }) {
  useTranslation()
  const [animEnter, setAnimEnter] = useState(false)

  useEffect(() => {
    if (visible && data) {
      const id = requestAnimationFrame(() => setAnimEnter(true))
      return () => {
        cancelAnimationFrame(id)
        setAnimEnter(false)
      }
    }
    setAnimEnter(false)
  }, [visible, data])

  if (!visible || !data) return null

  const handleOverlayClick = () => {
    onClose && onClose()
  }

  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  const type2Primary =
    data.primaryLine != null && data.primaryLine !== '' ? data.primaryLine : data.brandLine || ''

  const type2Secondary =
    data.secondaryLine != null && data.secondaryLine !== ''
      ? data.secondaryLine
      : data.storeName
      ? ti('621878cb.04bcd0', [data.storeName])
      : data.salespersonName
      ? ti('621878cb.04bcd0', [data.salespersonName])
      : ''

  const renderQrBlock = (primaryLine, secondaryLine) => (
    <View className='qr-code'>
      <View className='first-tip'>
        <Text>{$t('621878cb.41ea9b')}</Text>
      </View>
      <Image className='qrcode-image' src={data.qrcodeUrl} mode='aspectFit' showMenuByLongpress />
      {primaryLine ? (
        <View className='store-name'>
          <Text>{primaryLine}</Text>
        </View>
      ) : null}
      {secondaryLine ? (
        <View className='proxy'>
          <Text>{secondaryLine}</Text>
        </View>
      ) : null}
    </View>
  )

  return (
    <View
      className={classNames('consult-modal-overlay', {
        'consult-modal-overlay--enter': animEnter
      })}
      onClick={handleOverlayClick}
      catchMove
    >
      <View className='consult-modal-mask' />
      <View className='consult-modal' onClick={handleModalClick}>
        <View className='qiwei-wechat-content consult-modal-content'>
          <View className='close-btn' onClick={handleOverlayClick}>
            <Text className='iconfont icon-guanbi2'></Text>
          </View>
          {type === '1' ? (
            <>
              <View className='inner-text'>
                <Text>{$t('621878cb.c99618')}</Text>
              </View>
              <View className='inner-text'>
                <Text>{$t('621878cb.61bc2f')}</Text>
              </View>
              {renderQrBlock(data.storeName || '', '')}
            </>
          ) : (
            <>
              <View className='inner-text'>
                <Text>{$t('621878cb.c99618')}</Text>
              </View>
              <View className='inner-text'>
                <Text>{$t('621878cb.61bc2f')}</Text>
              </View>
              {renderQrBlock(type2Primary, type2Secondary)}
            </>
          )}
        </View>
      </View>
    </View>
  )
}

export default ConsultModal
