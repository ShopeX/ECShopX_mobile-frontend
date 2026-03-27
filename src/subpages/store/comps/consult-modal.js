/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { classNames } from '@/utils'

import './consult-modal.scss'

/**
 * 联系顾问弹框组件（布局对齐 Popup 企微弹窗 qiwei-wechat-content）
 * @param {boolean} visible - 是否显示弹框
 * @param {string} type - 弹框类型：'1'-门店二维码，'2'-导购二维码
 * @param {object} data - 弹框数据
 * @param {function} onClose - 关闭弹框回调
 */
function ConsultModal({ visible, type, data, onClose }) {
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
    data.primaryLine != null && data.primaryLine !== ''
      ? data.primaryLine
      : data.brandLine || ''

  const type2Secondary =
    data.secondaryLine != null && data.secondaryLine !== ''
      ? data.secondaryLine
      : data.storeName
        ? `${data.storeName} 门店顾问`
        : data.salespersonName
          ? `${data.salespersonName} 门店顾问`
          : ''

  const renderQrBlock = (primaryLine, secondaryLine) => (
    <View className='qr-code'>
      <View className='first-tip'>
        <Text>长按识别二维码</Text>
      </View>
      <Image
        className='qrcode-image'
        src={data.qrcodeUrl}
        mode='aspectFit'
        showMenuByLongpress
      />
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
                <Text>“添加我的企业微信，</Text>
              </View>
              <View className='inner-text'>
                <Text>让我为你提供专属服务吧。”</Text>
              </View>
              {renderQrBlock(data.storeName || '', '')}
            </>
          ) : (
            <>
              <View className='inner-text'>
                <Text>“添加我的企业微信，</Text>
              </View>
              <View className='inner-text'>
                <Text>让我为你提供专属服务吧。”</Text>
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
