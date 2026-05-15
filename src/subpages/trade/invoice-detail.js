/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpPage, SpCell, SpImage, SpPrice } from '@/components'
import { classNames, entryLaunch, showToast, authSetting, validate } from '@/utils'
import { useTranslation, $t } from '@/i18n'
import { useNavigation } from '@/hooks'
import api from '@/api'
import { useSelector } from 'react-redux'
import CompInvoiceModal from './comps/comp-invoice-modal'
import './invoice-detail.scss'

const initialState = {
  info: {
    invoice_type_code: '',
    invoice_type: '',
    invoice_amount: 0,
    invoice_items: []
  },
  confirmInfo: {
    id: '',
    email: ''
  },
  isOpened: false
}
function InvoiceDetail() {
  const { i18n } = useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const $router = useRouter()
  const { colorPrimary } = useSelector((state) => state.sys)
  const [state, setState] = useImmer(initialState)
  const { info, confirmInfo, isOpened } = state
  const { invoice_items = [] } = info

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('7c7278a2.01adae'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle, i18n])

  useEffect(() => {
    entryLaunch.getRouteParams($router?.params).then((params) => {
      if (params?.invoice_id) {
        fetchInvoiceDetail(params?.invoice_id)
      }
    })
  }, [])

  const fetchInvoiceDetail = async (invoice_id) => {
    const res = await api.trade.getInvoiceDetail(invoice_id)
    setState((draft) => {
      draft.info = res
    })
  }

  const handleClose = () => {
    setState((draft) => {
      draft.isOpened = false
    })
  }

  const handleConfirm = async (data) => {
    if (!validate.isEmail(data?.email)) {
      showToast($t('39274850.04154b'))
      return
    }
    await api.trade.resendInvoice({
      id: data.id,
      confirm_email: data.email
    })
    showToast($t('39274850.825111'))
    setState((draft) => {
      draft.isOpened = false
    })
  }

  const handleViewInvoice = (url) => {
    authSetting(
      'writePhotosAlbum',
      async () => {
        const { tempFilePath } = await Taro.downloadFile({
          url: url
        })
        Taro.openDocument({
          filePath: tempFilePath,
          showMenu: true,
          success: (res) => {
            console.log('打开文档成功')
          }
        })
      },
      () => {
        showToast($t('39274850.02225d'))
      }
    )
  }

  const handleCancel = async () => {
    const { confirm } = await Taro.showModal({
      title: $t('39274850.02d981'),
      content: $t('39274850.d5ba95'),
      cancelText: $t('39274850.625fb2'),
      confirmColor: colorPrimary,
      confirmText: $t('39274850.e83a25')
    })
    if (confirm) {
      await api.trade.updateInvoice({
        invoice_id: info?.id,
        invoice_status: 'cancel'
      })
      Taro.eventCenter.trigger('onEventInvoiceStatusChange')
      Taro.navigateBack()
    }
  }

  const renderStatus = () => {
    const statusMap = {
      pending: $t('39274850.963609'),
      inProgress: $t('39274850.030e4d'),
      success: $t('39274850.186ded'),
      failed: $t('39274850.65dcda'),
      waste: $t('39274850.dcc961')
    }
    return statusMap[info?.invoice_status] || info?.invoice_status
  }

  return (
    <SpPage
      className='invoice-detail'
      renderFooter={
        (info?.invoice_status === 'success' && info?.invoice_method !== 'offline') ||
        info?.invoice_status === 'pending' ? (
          <View className='btn-wrap'>
            {info?.invoice_status === 'success' && (
              <View
                className='btn-wrap__item'
                onClick={() => {
                  setState((draft) => {
                    draft.confirmInfo = {
                      id: info?.id,
                      email: info?.email
                    }
                    draft.isOpened = true
                  })
                }}
              >
                {$t('39274850.40928e')}
              </View>
            )}

            {info?.invoice_status === 'pending' && (
              <View className='btn-wrap__item' onClick={() => handleCancel()}>
                {$t('39274850.eaffc1')}
              </View>
            )}

            {info?.invoice_status === 'pending' && (
              <View
                className='btn-wrap__item'
                onClick={() => {
                  Taro.setStorageSync('invoice_params', {
                    invoice_type_code: info?.invoice_type_code || '02',
                    invoice_type: info?.invoice_type,
                    company_title: info?.company_title,
                    company_tax_number: info?.company_tax_number,
                    company_address: info?.company_address,
                    company_telephone: info?.company_telephone,
                    bank_name: info?.bank_name,
                    bank_account: info?.bank_account,
                    email: info?.email
                  })
                  Taro.redirectTo({
                    url: `/subpages/trade/invoice?invoice_id=${info?.id}&order_id=${info?.order_id}&invoice_amount=${info?.invoice_amount}&page_type=update`
                  })
                }}
              >
                {$t('39274850.f7f2b1')}
              </View>
            )}

            {info?.invoice_status === 'success' && (
              <View
                className='btn-wrap__item'
                onClick={() => handleViewInvoice(info?.invoice_file_url)}
              >
                {$t('39274850.121a39')}
              </View>
            )}
          </View>
        ) : null
      }
    >
      <ScrollView className='scroll-view-container' scrollY>
        <View className='invoice-detail__header'>
          <SpCell title={$t('39274850.c73256')}>
            <View className='invoice-detail__amount'>
              <View className='invoice-price'>￥{(info?.invoice_amount / 100).toFixed(2)}</View>
              <Text className={`invoice-detail__status ${info?.invoice_status}`}>
                {renderStatus()}
              </Text>
            </View>
          </SpCell>
        </View>

        <View className='invoice-detail__section'>
          {info?.invoice_type_code && (
            <SpCell title={$t('39274850.9c1f61')} border>
              <Text className='invoice-detail__value'>
                {info?.invoice_type_code === '01' ? $t('39274850.515a32') : $t('39274850.747c7a')}
              </Text>
            </SpCell>
          )}
          {info?.invoice_type === 'individual' && (
            <>
              <SpCell title={$t('39274850.6cbd05')} border>
                <Text className='invoice-detail__tag'>{$t('39274850.6a0e04')}</Text>
                <Text className='invoice-detail__value'>{info?.company_title}</Text>
              </SpCell>
            </>
          )}
          {info?.invoice_type === 'enterprise' && (
            <>
              <SpCell title={$t('39274850.6cbd05')} border>
                <Text className='invoice-detail__tag company'>{$t('39274850.04c9e3')}</Text>
                <Text className='invoice-detail__value'>{info?.company_title}</Text>
              </SpCell>
              <SpCell title={$t('39274850.5b82c6')} border>
                <Text className='invoice-detail__value'>{info?.company_tax_number}</Text>
              </SpCell>
              <SpCell title={$t('39274850.e06494')} border>
                <Text className='invoice-detail__value'>{info?.company_address}</Text>
              </SpCell>
              <SpCell title={$t('39274850.9e1660')} border>
                <Text className='invoice-detail__value'>{info?.company_telephone}</Text>
              </SpCell>
              <SpCell title={$t('39274850.500195')} border>
                <Text className='invoice-detail__value'>{info?.bank_name}</Text>
              </SpCell>
              <SpCell title={$t('39274850.fe577c')} border>
                <Text className='invoice-detail__value'>{info?.bank_account}</Text>
              </SpCell>
            </>
          )}
          <SpCell title={$t('39274850.7148d5')} border={false}>
            <Text className='invoice-detail__value'>{info?.email}</Text>
          </SpCell>
        </View>

        <View className='invoice-detail__section'>
          <View className='invoice-detail__title'>{$t('39274850.3c1167')}</View>
          <View className='invoice-detail__list'>
            {invoice_items?.map((item, idx) => (
              <View className='invoice-detail__item' key={idx}>
                <View className='invoice-detail__item-img'>
                  <SpImage
                    width={134}
                    height={134}
                    mode='aspectFill'
                    src={item.item_bn != 'shippingFeeLine888' ? item.main_img : 'fv_freight.png'}
                  />
                </View>
                <View className='invoice-detail__item-info'>
                  <View>
                    <View className='invoice-detail__item-name'>{item.item_name}</View>
                    {item.item_bn != 'shippingFeeLine888' && (
                      <View className='invoice-detail__item__spec'>
                        <Text className='invoice-detail__item__spec-label'>{item.spec_info}</Text>
                        <Text className='invoice-detail__item__spec-value'>×{item.num}</Text>
                      </View>
                    )}
                  </View>
                  <View>
                    <View className='invoice-detail__item-price'>
                      ￥{(item?.amount / 100).toFixed(2)}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <CompInvoiceModal
        confirmInfo={confirmInfo}
        open={isOpened}
        onClose={handleClose}
        onConfirm={(data) => handleConfirm(data)}
      />
    </SpPage>
  )
}

export default InvoiceDetail
