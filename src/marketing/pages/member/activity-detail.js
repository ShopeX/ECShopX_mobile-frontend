/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { View, Text, Canvas } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { SpPage, SpImage } from '@/components'
import { SpSelectModal } from '@/subpages/components'
import { $t, ti } from '@/i18n'
import api from '@/api'
import QRCode from 'qrcode'
import * as activityDoc from '@/doc/activity'
import { pickBy } from '@/utils'
import './activity-detail.scss'

const QR_CANVAS_ID = 'activityVerifyQr'
const QR_SIZE = 270
const IS_H5 = process.env.TARO_ENV === 'h5'

const initialState = {
  info: {},
  isOpened: false,
  qrcode: ''
}

/** 小程序无 TextEncoder，手动转 UTF-8 字节供 qrcode 使用 */
const utf8ToUint8Array = (str) => {
  const encoded = unescape(encodeURIComponent(str))
  const arr = new Uint8Array(encoded.length)
  for (let i = 0; i < encoded.length; i++) {
    arr[i] = encoded.charCodeAt(i)
  }
  return arr
}

/** 小程序无 DOM canvas / TextEncoder：Canvas 2D 绘制后导出临时路径 */
const createQrImageByCanvas = (text, size = QR_SIZE, retry = 0) =>
  new Promise((resolve, reject) => {
    Taro.nextTick(() => {
      Taro.createSelectorQuery()
        .select(`#${QR_CANVAS_ID}`)
        .fields({ node: true, size: true })
        .exec(async (res) => {
          const canvas = res?.[0]?.node
          if (!canvas) {
            if (retry < 3) {
              setTimeout(() => {
                createQrImageByCanvas(text, size, retry + 1).then(resolve).catch(reject)
              }, 50)
              return
            }
            reject(new Error('qr canvas not found'))
            return
          }
          try {
            const ctx = canvas.getContext('2d')
            const dpr = Taro.getSystemInfoSync().pixelRatio || 1
            canvas.width = size * dpr
            canvas.height = size * dpr
            ctx.scale(dpr, dpr)

            const qr = QRCode.create([{ data: utf8ToUint8Array(text), mode: 'byte' }], {
              errorCorrectionLevel: 'M'
            })
            const moduleCount = qr.modules.size
            const margin = 2
            const total = moduleCount + margin * 2
            const cellSize = size / total

            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, size, size)
            ctx.fillStyle = '#000000'
            for (let row = 0; row < moduleCount; row++) {
              for (let col = 0; col < moduleCount; col++) {
                if (qr.modules.get(row, col)) {
                  ctx.fillRect(
                    (col + margin) * cellSize,
                    (row + margin) * cellSize,
                    cellSize,
                    cellSize
                  )
                }
              }
            }

            // 小程序 canvas.toDataURL 不稳定，用官方导出临时文件
            const { tempFilePath } = await Taro.canvasToTempFilePath({
              canvas,
              x: 0,
              y: 0,
              width: size,
              height: size,
              destWidth: size * dpr,
              destHeight: size * dpr,
              fileType: 'png'
            })
            resolve(tempFilePath)
          } catch (err) {
            reject(err)
          }
        })
    })
  })
function ActivityDetail(props) {
  const { i18n } = useTranslation()
  const colors = useSelector((state) => state.sys)
  const [state, setState] = useImmer(initialState)
  const { info, isOpened, qrcode } = state
  const router = useRouter()
  const verifyRef = useRef()

  const selectOptions = useMemo(
    () => [
      { label: $t('c012603a.1f8f1b'), value: '0' },
      { label: $t('c012603a.78206f'), value: '1' }
    ],
    [i18n.language]
  )

  const statusMap = {
    'pending': 'daishenhe1',
    'passed': 'yibaoming',
    'rejected': 'yijujue',
    'verified': 'yihexiao',
    'canceled': 'yiquxiao'
  }

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: $t('c012603a.41c54a') })
  }, [i18n.language])

  useDidShow(() => {
    fetch()
  })

  useEffect(() => {
    return () => {
      verifyRef.current && clearInterval(verifyRef.current)
    }
  }, [])

  const getQrCode = async ({ verifyCode, recordId }) => {
    if (!verifyCode) return
    const content = JSON.stringify({
      verify_code: verifyCode,
      record_id: recordId
    })
    try {
      const res = IS_H5
        ? await QRCode.toDataURL(content, { width: QR_SIZE, margin: 1 })
        : await createQrImageByCanvas(content, QR_SIZE)
      setState((draft) => {
        draft.qrcode = res
      })
      if (verifyRef.current) {
        clearInterval(verifyRef.current)
      }
      verifyRef.current = setInterval(() => {
        fetch('isVerify')
      }, 3000)
    } catch (err) {
      console.error('getQrCode', err)
    }
  }

  const fetch = async (isVerify) => {
    const res = await api.user.registrationRecordInfo({
      record_id: router?.params.record_id
    })

    console.log(res)
    const _info = pickBy(res, activityDoc.RECORD_DETAIL)
    if (isVerify) {
      if (_info.status == 'passed') return
      if (_info.status == 'verified' && verifyRef.current) {
        clearInterval(verifyRef.current)
      }
    }

    if (!isVerify) {
      verifyRef.current && clearInterval(verifyRef.current)
    }

    if (_info.isOfflineVerify && _info.status == 'passed') {
      getQrCode(_info)
    }
    setState((draft) => {
      draft.info = _info
    })
  }

  const renderFormItemValue = ({ answer, field_name }) => {
    console.log('answer', answer)
    if (
      typeof answer == 'string' &&
      ['Attachment upload', 'Attendance IDCard'].includes(field_name)
    ) {
      return (
        <View className='pic-item'>
          {answer?.split(',')?.map((item, idx) => (
            <SpImage src={item} key={idx} width={173} height={173} mode='aspectFit' />
          ))}
        </View>
      )
    } else {
      return answer
    }
  }

  const handleCancel = async () => {
    const res = await Taro.showModal({
      title: $t('61e2d21a.02d981'),
      content: $t('c012603a.f8b026'),
      showCancel: true,
      cancel: $t('61e2d21a.625fb2'),
      cancelText: $t('61e2d21a.625fb2'),
      confirmText: $t('settings.confirm'),
      confirmColor: colors.colorPrimary
    })
    if (res.confirm) {
      await api.user.cancelRecord({
        record_id: info.recordId
      })
      fetch()
      setTimeout(() => {
        Taro.eventCenter.trigger('onEventRecordStatusChange')
      }, 200)
    }
  }

  const handleSelectClose = () => {
    setState((draft) => {
      draft.isOpened = false
    })
  }

  const handleSlectConfirm = (value) => {
    const { activityId, recordId } = info
    let url = `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}`
    if (value == '0') {
      url += `&record_id=${recordId}`
    }
    Taro.navigateTo({
      url
    })
    handleSelectClose()
  }

  const registrationSubmitFetch = async ({ activityId }) => {
    await api.user.joinActivity({ activity_id: activityId })
    Taro.showToast({
      icon: 'none',
      title: $t('c012603a.b90d81')
    })
    setTimeout(() => {
      Taro.navigateTo({
        url: `/marketing/pages/reservation/goods-reservate-result?activity_id=${activityId}`
      })
    }, 400)
  }

  const onBtnAction = (type) => {
    const { activityId, recordId, status, hasTemp } = info
    switch (type) {
      case 'reFill':
        Taro.navigateTo({
          url: `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}&record_id=${recordId}`
        })
        break
      case 'sign':
        if (hasTemp) {
          if (['passed', 'canceled', 'verified'].includes(status)) {
            Taro.navigateTo({
              url: `/marketing/pages/reservation/goods-reservate?activity_id=${activityId}`
            })
          } else {
            setState((draft) => {
              draft.isOpened = true
            })
          }
        } else {
          registrationSubmitFetch(info)
        }

        break
      default:
        break
    }
  }

  const renderFooter = () => {
    const { actionCancel, actionEdit, actionApply } = info || {}

    if (!actionCancel && !actionEdit && !actionApply) return null

    return (
      <View className='activity-detail__footer'>
        {actionCancel && (
          <View className='activity-detail__footer-btn' onClick={handleCancel}>
            {$t('c012603a.caca39')}
          </View>
        )}
        {actionEdit && (
          <View
            className='activity-detail__footer-btn refill-btn'
            onClick={() => onBtnAction('reFill')}
          >
            {$t('c012603a.a5c7b5')}
          </View>
        )}
        {actionApply && (
          <View
            className='activity-detail__footer-btn refill-btn'
            onClick={() => onBtnAction('sign')}
          >
            {$t('c012603a.1e6c87')}
          </View>
        )}
      </View>
    )
  }

  console.log('info', info)

  return (
    <SpPage className='page-activity-detail' renderFooter={renderFooter()}>
      {!IS_H5 && (
        <Canvas
          type='2d'
          id={QR_CANVAS_ID}
          style={{
            width: `${QR_SIZE}px`,
            height: `${QR_SIZE}px`,
            position: 'fixed',
            left: '-9999px',
            top: '-9999px'
          }}
        />
      )}
      <View className='activity-detail'>
        <View className='activity-detail__hd'></View>
        <View className='activity-detail__header'>
          <View className='activity-detail__header-left'>
            <View className='activity-detail__header-left-status'>
              <Text className={`iconfont icon-${statusMap[info?.status]}`}></Text>
              {info?.statusName}
            </View>

            {info.reason && (
              <View className='activity-detail__header-left-reason'>{info.reason}</View>
            )}
          </View>
          {info?.recordNo && (
            <View className='activity-detail__header-right'>
              {ti('c012603a.e6bb26', [info.recordNo])}
            </View>
          )}
        </View>

        <View className='activity-detail__info'>
          <View className='activity-detail__info-title'>{info.activityName}</View>
          {info.showTime && <View className='activity-detail__info-time'>{info?.intro}</View>}
          {info.showPlace && (
            <View className={`activity-detail__info-area${!info.showAddress ? ' no-margin' : ''}`}>
              <View className='activity-detail__info-area-label'>{$t('c012603a.adb1b6')}</View>
              <View className='activity-detail__info-area-content'>{info?.activityPlace}</View>
            </View>
          )}
          {info.showAddress && (
            <View className='activity-detail__info-area no-margin'>
              <View className='activity-detail__info-area-label'>{$t('c012603a.75c1f8')}</View>
              <View className='activity-detail__info-area-content'>{info?.activityAddress}</View>
            </View>
          )}

          {qrcode && info?.status == 'passed' && (
            <View className='activity-detail__info-code'>
              <View className='activity-detail__info-code-box'>
                <View className='activity-detail__info-code-title'>{$t('c012603a.0a029e')}</View>
                <View className='activity-detail__info-code-img'>
                  <SpImage src={qrcode} width={270} />
                </View>
              </View>
            </View>
          )}
        </View>

        <View className='activity-detail__form'>
          <View className='activity-detail__form-item'>
            <View className='activity-detail__form-item-label'>{$t('c012603a.8098e2')}</View>
            <View className='activity-detail__form-item-value'>{info?.mobile}</View>
          </View>
          <View className='activity-detail__form-item'>
            <View className='activity-detail__form-item-label'>{$t('c012603a.c07abe')}</View>
            <View className='activity-detail__form-item-value'>{info?.getPoints}</View>
          </View>
          {info?.formData?.length > 0 &&
            info.formData.map((item, idx) => (
              <View className='activity-detail__form-item' key={idx}>
                <View className='activity-detail__form-item-label'>{item.field_title}</View>
                <View className='activity-detail__form-item-value'>
                  {renderFormItemValue(item)}
                </View>
              </View>
            ))}
        </View>
      </View>

      <SpSelectModal
        isOpened={isOpened}
        options={selectOptions}
        onClose={handleSelectClose}
        onConfirm={handleSlectConfirm}
      />
    </SpPage>
  )
}

ActivityDetail.options = {
  addGlobalClass: true
}

export default ActivityDetail
