/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import { SpPrice, SpCell, SpFloatLayout, SpPage, SpImage, SpInput as AtInput } from '@/components'
import S from '@/spx'
import api from '@/api'
import { classNames, isWeixin, entryLaunch, authSetting, showToast, validate } from '@/utils'
import { useTranslation, $t, ti } from '@/i18n'
import { useNavigation } from '@/hooks'
import { debounce } from 'lodash'
import './invoice.scss'

const initialState = {
  info: {
    invoice_type_code: '02', // 01:数电票(增值税专用发票) 02:数电票(普通发票)
    invoice_type: 'individual', // individual:个人 enterprise:企业
    company_title: '', // 抬头名称
    individual_title: '', // 个人抬头
    company_tax_number: '', // 公司税号
    company_address: '', // 公司地址
    company_telephone: '', // 公司电话
    bank_name: '', // 开户银行
    bank_account: '', // 开户账号
    email: '' // 电子邮箱
  },
  allInfo: false,
  invoice_amount: 0,
  order_id: '',
  invoice_id: '',
  page_type: 'apply',
  openRefundType: false,
  showSpecialInvoice: false,
  protocolShow: true,
  protocolTitle: '',
  protocolCheck: false
}

function Invoice(props) {
  const { i18n } = useTranslation()
  const { setNavigationBarTitle } = useNavigation()
  const $router = useRouter()
  const [state, setState] = useImmer(initialState)
  const {
    info,
    allInfo,
    invoice_amount,
    openRefundType,
    order_id,
    invoice_id,
    page_type,
    showSpecialInvoice,
    protocolShow,
    protocolTitle,
    protocolCheck
  } = state

  useEffect(() => {
    const syncTitle = () => setNavigationBarTitle($t('54543957.a5f23f'))
    syncTitle()
    i18n.on('languageChanged', syncTitle)
    return () => i18n.off('languageChanged', syncTitle)
  }, [setNavigationBarTitle, i18n])

  useEffect(() => {
    entryLaunch.getRouteParams($router?.params).then((params) => {
      setState((draft) => {
        draft.invoice_amount = params?.invoice_amount || 0
        draft.order_id = params?.order_id || ''
        draft.invoice_id = params?.invoice_id || ''
        draft.page_type = params?.page_type || 'apply'
      })
    })
    const params = Taro.getStorageSync('invoice_params')
    console.log('params:', params)
    if (params && Object.keys(params).length > 0) {
      let invoiceParams = {
        invoice_type_code: params?.invoice_type_code || '02',
        invoice_type: params?.invoice_type || 'individual',
        company_title: params?.invoice_type == 'enterprise' ? params?.company_title : '',
        individual_title: params?.invoice_type != 'enterprise' ? params?.company_title : '',
        company_tax_number: params?.company_tax_number || '',
        company_address: params?.company_address || '',
        company_telephone: params?.company_telephone || '',
        bank_name: params?.bank_name || '',
        bank_account: params?.bank_account || '',
        email: params?.email || ''
      }

      setState((draft) => {
        draft.info = invoiceParams
      })
    }
    getInvoiceSetting()
    getInvoiceProtocol()
  }, [])

  const getInvoiceSetting = async () => {
    const { special_invoice } = await api.trade.getInvoiceSetting()
    setState((draft) => {
      draft.showSpecialInvoice = special_invoice == '1'
    })
  }

  const getInvoiceProtocol = async () => {
    const { title, special_invoice_confirm_open } = await api.trade.getInvoiceProtocol()
    setState((draft) => {
      draft.protocolTitle = title
      draft.protocolShow = special_invoice_confirm_open == '1'
    })
  }

  const wxInvoice = () => {
    authSetting('invoiceTitle', async () => {
      const res = await Taro.chooseInvoiceTitle()
      if (res.errMsg === 'chooseInvoiceTitle:ok') {
        console.log(res)
        const { type, title, companyAddress, taxNumber, bankName, bankAccount, telephone } = res
        let nInfo = {
          invoice_type: type == 0 ? 'enterprise' : 'individual',
          invoice_type_code: info.invoice_type_code,
          email: info?.email
        }
        if (type == 0) {
          nInfo = {
            ...nInfo,
            company_title: title,
            individual_title: info?.individual_title,
            company_tax_number: taxNumber,
            company_address: companyAddress,
            company_telephone: telephone,
            bank_name: bankName,
            bank_account: bankAccount
          }
        } else {
          nInfo = {
            ...nInfo,
            company_title: info?.company_title,
            individual_title: title,
            invoice_type_code: '02'
          }
        }
        setState((draft) => {
          draft.info = nInfo
        })
      }
    })
  }

  const handleClickSubmit = debounce(
    async () => {
      if (!isFull()) {
        return
      }
      if (info?.email && !validate.isEmail(info?.email)) {
        showToast($t('67cd5a59.04154b'))
        return
      }
      if (protocolShow && info.invoice_type_code === '01' && !protocolCheck) {
        showToast(ti('67cd5a59.cbcf35', [protocolTitle]))
        return
      }
      if (info?.invoice_type == 'enterprise' && info?.company_tax_number?.length != 18) {
        showToast($t('67cd5a59.a145f7'))
        return
      }
      let params = {
        invoice_type_code: info?.invoice_type_code,
        invoice_type: info?.invoice_type,
        company_title:
          info?.invoice_type == 'enterprise' ? info?.company_title : info?.individual_title,
        email: info?.email
      }
      if (params.invoice_type === 'enterprise') {
        params = {
          ...params,
          ...info
        }
      }
      if (page_type === 'checkout') {
        Taro.eventCenter.trigger('onEventCheckoutInvoiceChange', params)
        Taro.navigateBack()
      } else {
        if (invoice_id) {
          params = {
            ...params,
            invoice_id: invoice_id
          }
        }
        const res = await api.trade[invoice_id ? 'updateInvoice' : 'applyInvoice']({
          ...params,
          order_id: order_id
        })
        Taro.eventCenter.trigger('onEventInvoiceStatusChange')
        Taro.redirectTo({
          url: `/subpages/trade/invoice-success?invoice_id=${res.id}`
        })
      }
    },
    1000,
    {
      leading: true,
      trailing: false
    }
  )

  const handleChange = (name, val) => {
    const nInfo = JSON.parse(JSON.stringify(state.info || {}))
    nInfo[name] = val
    // if (name === 'invoice_type') {
    //   nInfo.company_title = ''
    //   nInfo.company_tax_number = ''
    //   nInfo.company_address = ''
    //   nInfo.company_telephone = ''
    //   nInfo.bank_name = ''
    //   nInfo.bank_account = ''
    // }
    if (name === 'invoice_type_code' && val === '01') {
      nInfo.invoice_type = 'enterprise'
    }
    setState((draft) => {
      draft.info = nInfo
    })
  }

  const isFull = () => {
    if (info?.invoice_type === 'individual') {
      return info?.individual_title && info?.email
    } else if (info?.invoice_type === 'enterprise') {
      return info?.company_title && info?.company_tax_number && info?.email
    }
  }

  return (
    <SpPage
      className='page-invoice'
      renderFooter={
        <View className='page-invoice__footer'>
          {protocolShow && info.invoice_type_code === '01' && (
            <View className='privacy-box'>
              <Text
                className={classNames('iconfont', {
                  'icon-roundcheckfill': protocolCheck,
                  'icon-round': !protocolCheck
                })}
                onClick={() => {
                  setState((draft) => {
                    draft.protocolCheck = !protocolCheck
                  })
                }}
              />
              {$t('67cd5a59.ee1dfe')}
              <Text
                onClick={() =>
                  Taro.navigateTo({ url: '/subpages/auth/reg-rule?type=invoice_protocol' })
                }
                className='privacy-txt'
              >
                《{protocolTitle || $t('67cd5a59.0a10b1')}》
              </Text>
            </View>
          )}

          <View className='btn-wrap'>
            {isWeixin && (
              <View className='btn-wrap__harvest' onClick={wxInvoice}>
                <View className='btn-wrap-img-wrap'>
                  <SpImage className='btn-wrap-img' src='fv_wechat.png' />
                </View>
                {$t('67cd5a59.9e8b15')}
              </View>
            )}
            <View
              className={classNames({
                'btn-wrap__add': true,
                'btn-wrap__all': !isWeixin,
                'btn-wrap__disabled': !isFull()
              })}
              onClick={handleClickSubmit}
            >
              {$t('67cd5a59.4ac397')}
            </View>
          </View>
        </View>
      }
      footerHeight={protocolShow && info.invoice_type_code === '01' ? 180 : 124}
    >
      <ScrollView className='scroll-view-container' scrollY>
        <View className='page-invoice__form'>
          {page_type != 'checkout' && (
            <>
              <SpCell className='border-bottom' title={$t('67cd5a59.3e8657')}>
                <View className='invoice-order-id'>{order_id}</View>
              </SpCell>
              <SpCell title={$t('67cd5a59.c73256')}>
                <View className='invoice-price'>￥{(invoice_amount / 100).toFixed(2)}</View>
              </SpCell>
            </>
          )}

          <View className='invoice-box'></View>
          <SpCell className='border-bottom' title={$t('67cd5a59.9c1f61')}>
            <View
              className='cell-wrap justify-between'
              onClick={() => {
                setState((draft) => {
                  draft.openRefundType = true
                })
              }}
            >
              <View className='cell-wrap__item-text'>
                {info.invoice_type_code === '02'
                  ? $t('67cd5a59.747c7a')
                  : $t('67cd5a59.515a32')}
              </View>
              <View className='iconfont icon-arrowRight'></View>
            </View>
          </SpCell>
          <SpCell className='border-bottom' title={$t('67cd5a59.01b477')}>
            <View className='cell-wrap'>
              <View
                className='cell-wrap__item'
                onClick={() => handleChange('invoice_type', 'enterprise')}
              >
                <Text
                  className={classNames({
                    iconfont: true,
                    'icon-a-iconcheck_box01': info?.invoice_type === 'enterprise',
                    'icon-a-iconcheck_box_outline_blank': info?.invoice_type === 'individual'
                  })}
                />
                <Text className='cell-wrap__item-text'>{$t('67cd5a59.04c9e3')}</Text>
              </View>
              {info.invoice_type_code === '02' && (
                <View
                  className='cell-wrap__item'
                  onClick={() => handleChange('invoice_type', 'individual')}
                >
                  <Text
                    className={classNames({
                      iconfont: true,
                      'icon-a-iconcheck_box01': info?.invoice_type === 'individual',
                      'icon-a-iconcheck_box_outline_blank': info?.invoice_type === 'enterprise'
                    })}
                  />
                  <Text className='cell-wrap__item-text'>{$t('67cd5a59.6a0e04')}</Text>
                </View>
              )}
            </View>
          </SpCell>
          {info?.invoice_type === 'individual' && (
            <SpCell title={$t('67cd5a59.9981ea')}>
              <AtInput
                name='individual_title'
                value={info?.individual_title}
                placeholder={$t('67cd5a59.537b39')}
                placeholderClass='input-placeholder'
                onChange={(e) => handleChange('individual_title', e)}
              />
            </SpCell>
          )}
          {info?.invoice_type === 'enterprise' && (
            <>
              <SpCell title={$t('67cd5a59.d4b097')}>
                <AtInput
                  name='company_title'
                  value={info?.company_title}
                  placeholder={$t('67cd5a59.537b39')}
                  placeholderClass='input-placeholder'
                  onChange={(e) => handleChange('company_title', e)}
                />
              </SpCell>
              <SpCell title={$t('67cd5a59.5b82c6')}>
                <AtInput
                  name='company_tax_number'
                  value={info?.company_tax_number}
                  placeholder={$t('67cd5a59.537b39')}
                  placeholderClass='input-placeholder'
                  onChange={(e) => handleChange('company_tax_number', e)}
                />
              </SpCell>
              {allInfo && (
                <>
                  <SpCell className='border-bottom' title={$t('67cd5a59.e06494')}>
                    <AtInput
                      name='company_address'
                      value={info?.company_address}
                      placeholder={$t('67cd5a59.93a438')}
                      placeholderClass='input-placeholder'
                      onChange={(e) => handleChange('company_address', e)}
                    />
                  </SpCell>
                  <SpCell className='border-bottom' title={$t('67cd5a59.9e1660')}>
                    <AtInput
                      name='company_telephone'
                      value={info?.company_telephone}
                      placeholder={$t('67cd5a59.93a438')}
                      placeholderClass='input-placeholder'
                      onChange={(e) => handleChange('company_telephone', e)}
                    />
                  </SpCell>
                  <SpCell className='border-bottom' title={$t('67cd5a59.500195')}>
                    <AtInput
                      name='bank_name'
                      value={info?.bank_name}
                      placeholder={$t('67cd5a59.93a438')}
                      placeholderClass='input-placeholder'
                      onChange={(e) => handleChange('bank_name', e)}
                    />
                  </SpCell>
                  <SpCell className='border-bottom' title={$t('67cd5a59.fe577c')}>
                    <AtInput
                      name='bank_account'
                      value={info?.bank_account}
                      placeholder={$t('67cd5a59.93a438')}
                      placeholderClass='input-placeholder'
                      onChange={(e) => handleChange('bank_account', e)}
                    />
                  </SpCell>
                </>
              )}

              <View
                className='more-box'
                onClick={() => {
                  setState((draft) => {
                    draft.allInfo = !allInfo
                  })
                }}
              >
                <Text className='more-box__text'>
                  {allInfo ? $t('67cd5a59.493b87') : $t('67cd5a59.d6d09d')}
                </Text>
                <Text
                  className={classNames({
                    iconfont: true,
                    'icon-arrowUp': allInfo,
                    'icon-arrowDown': !allInfo
                  })}
                />
              </View>
            </>
          )}

          <View className='invoice-box'>
            <View className='invoice-box__title'>{$t('67cd5a59.a68e45')}</View>
            <SpCell className='border-bottom' title={$t('67cd5a59.7148d5')}>
              <AtInput
                name='email'
                value={info?.email}
                placeholder={$t('67cd5a59.537b39')}
                placeholderClass='input-placeholder'
                onChange={(e) => handleChange('email', e)}
              />
            </SpCell>
            <View className='invoice-box__bottom'></View>
          </View>
        </View>
      </ScrollView>
      <SpFloatLayout
        title={$t('67cd5a59.c86a67')}
        open={openRefundType}
        className='invoice-type-float'
        onClose={() => {
          setState((draft) => {
            draft.openRefundType = false
          })
        }}
      >
        <View className='invoice-type-box'>
          <View
            className={classNames('invoice-type-option', {
              selected: info.invoice_type_code === '02'
            })}
            onClick={() => {
              handleChange('invoice_type_code', '02')
            }}
          >
            <View className='option-header'>
              <Text className='option-title'>{$t('67cd5a59.747c7a')}</Text>
              <Text
                className={classNames('iconfont', {
                  'icon-roundcheckfill': info.invoice_type_code === '02',
                  'icon-round': info.invoice_type_code !== '02'
                })}
              />
              <Text className='option-electronic'>{$t('67cd5a59.b0a65b')}</Text>
            </View>
            <View className='option-desc'>{$t('67cd5a59.366887')}</View>
          </View>
          {showSpecialInvoice && (
            <View
              className={classNames('invoice-type-option', {
                selected: info.invoice_type_code === '01'
              })}
              onClick={() => {
                handleChange('invoice_type_code', '01')
              }}
            >
              <View className='option-header'>
                <Text className='option-title'>{$t('67cd5a59.515a32')}</Text>
                <Text
                  className={classNames('iconfont', {
                    'icon-roundcheckfill': info.invoice_type_code === '01',
                    'icon-round': info.invoice_type_code !== '01'
                  })}
                />
                <Text className='option-electronic'>{$t('67cd5a59.b0a65b')}</Text>
              </View>
              <View className='option-desc'>{$t('67cd5a59.73feaa')}</View>
            </View>
          )}
        </View>
        <View className='invoice-type-tips'>{$t('67cd5a59.c22ae6')}</View>
      </SpFloatLayout>
    </SpPage>
  )
}

Invoice.options = {
  addGlobalClass: true
}

export default Invoice
