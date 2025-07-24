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
import './invoice.scss'

const initialState = {
  info: {
    invoice_type_code: '02', // 01:数电票(增值税专用发票) 02:数电票(普通发票)
    invoice_type: 'individual', // individual:个人 enterprise:企业
    company_title: '', // 抬头名称
    company_tax_number: '', // 公司税号
    company_address: '', // 公司地址
    company_telephone: '', // 公司电话
    bank_name: '', // 开户银行
    bank_account: '', // 开户账号
    email: '', // 电子邮箱
    mobile: '' // 手机号
  },
  allInfo: false,
  invoice_amount: 0,
  order_id: '',
  invoice_id: '',
  page_type: 'apply',
  openRefundType: false,
  showSpecialInvoice: false,
  protocolShow: true,
  protocolTitle: '专票使用确认书',
  protocolCheck: false
}

function Invoice(props) {
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
    entryLaunch.getRouteParams($router.params).then((params) => {
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
      const invoiceParams = {
        invoice_type_code: params?.invoice_type_code || '02',
        invoice_type: params?.invoice_type || 'individual',
        company_title: params?.company_title || '',
        company_tax_number: params?.company_tax_number || '',
        company_address: params?.company_address || '',
        company_telephone: params?.company_telephone || '',
        bank_name: params?.bank_name || '',
        bank_account: params?.bank_account || '',
        email: params?.email || '',
        mobile: params?.mobile || ''
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
          company_title: title,
          email: info?.email,
          mobile: info?.mobile
        }
        if (type == 0) {
          nInfo = {
            ...nInfo,
            company_tax_number: taxNumber,
            company_address: companyAddress,
            company_telephone: telephone,
            bank_name: bankName,
            bank_account: bankAccount
          }
        } else {
          nInfo = {
            ...nInfo,
            invoice_type_code: '02'
          }
        }
        setState((draft) => {
          draft.info = nInfo
        })
      }
    })
  }

  const handleClickSubmit = async () => {
    if (!isFull()) {
      return
    }
    if (info?.email && !validate.isEmail(info?.email)) {
      showToast('请输入正确的电子邮箱')
      return
    }
    if (info?.mobile && !validate.isMobileNum(info?.mobile)) {
      showToast('请输入正确的手机号')
      return
    }
    if (protocolShow && info.invoice_type_code === '01' && !protocolCheck) {
      showToast(`请同意${protocolTitle}`)
      return
    }
    let params = {
      invoice_type_code: info?.invoice_type_code,
      invoice_type: info?.invoice_type,
      company_title: info?.company_title,
      email: info?.email,
      mobile: info?.mobile
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
  }

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
      return info?.company_title && (info?.email || info?.mobile)
    } else if (info?.invoice_type === 'enterprise') {
      return info?.company_title && info?.company_tax_number && (info?.email || info?.mobile)
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
              我已阅读并同意
              <Text
                onClick={() =>
                  Taro.navigateTo({ url: '/subpages/auth/reg-rule?type=invoice_protocol' })
                }
                className='privacy-txt'
              >
                《{protocolTitle}》
              </Text>
            </View>
          )}

          <View className='btn-wrap'>
            {isWeixin && (
              <View className='btn-wrap__harvest' onClick={wxInvoice}>
                <View className='btn-wrap-img-wrap'>
                  <SpImage className='btn-wrap-img' src='fv_wechat.png' />
                </View>
                选择微信开票信息
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
              提交发票
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
              <SpCell className='border-bottom' title='订单编号'>
                <View className='invoice-order-id'>{order_id}</View>
              </SpCell>
              <SpCell title='开票金额'>
                <View className='invoice-price'>￥{(invoice_amount / 100).toFixed(2)}</View>
              </SpCell>
            </>
          )}

          <View className='invoice-box'></View>
          <SpCell className='border-bottom' title='发票类型'>
            <View
              className='cell-wrap justify-between'
              onClick={() => {
                setState((draft) => {
                  draft.openRefundType = true
                })
              }}
            >
              <View className='cell-wrap__item-text'>
                {info.invoice_type_code === '02' ? '普通发票' : '专用发票'}
              </View>
              <View className='iconfont icon-arrowRight'></View>
            </View>
          </SpCell>
          <SpCell className='border-bottom' title='抬头类型'>
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
                <Text className='cell-wrap__item-text'>企业</Text>
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
                  <Text className='cell-wrap__item-text'>个人</Text>
                </View>
              )}
            </View>
          </SpCell>
          {info?.invoice_type === 'individual' && (
            <SpCell title='抬头名称'>
              <AtInput
                name='company_title'
                value={info?.company_title}
                placeholder='必填'
                placeholderClass='input-placeholder'
                onChange={(e) => handleChange('company_title', e)}
              />
            </SpCell>
          )}
          {info?.invoice_type === 'enterprise' && (
            <>
              <SpCell title='公司名称'>
                <AtInput
                  name='company_title'
                  value={info?.company_title}
                  placeholder='必填'
                  placeholderClass='input-placeholder'
                  onChange={(e) => handleChange('company_title', e)}
                />
              </SpCell>
              <SpCell title='公司税号'>
                <AtInput
                  name='company_tax_number'
                  value={info?.company_tax_number}
                  placeholder='必填'
                  placeholderClass='input-placeholder'
                  onChange={(e) => handleChange('company_tax_number', e)}
                />
              </SpCell>
              {allInfo && (
                <>
                  <SpCell className='border-bottom' title='公司地址'>
                    <AtInput
                      name='company_address'
                      value={info?.company_address}
                      placeholder='选填'
                      placeholderClass='input-placeholder'
                      onChange={(e) => handleChange('company_address', e)}
                    />
                  </SpCell>
                  <SpCell className='border-bottom' title='公司电话'>
                    <AtInput
                      name='company_telephone'
                      value={info?.company_telephone}
                      placeholder='选填'
                      placeholderClass='input-placeholder'
                      onChange={(e) => handleChange('company_telephone', e)}
                    />
                  </SpCell>
                  <SpCell className='border-bottom' title='公司银行'>
                    <AtInput
                      name='bank_name'
                      value={info?.bank_name}
                      placeholder='选填'
                      placeholderClass='input-placeholder'
                      onChange={(e) => handleChange('bank_name', e)}
                    />
                  </SpCell>
                  <SpCell className='border-bottom' title='公司账号'>
                    <AtInput
                      name='bank_account'
                      value={info?.bank_account}
                      placeholder='选填'
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
                  {allInfo ? '收起选填信息' : '更多填写项（选填）'}
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
            <View className='invoice-box__title'>接收方式</View>
            <SpCell className='border-bottom' title='电子邮箱'>
              <AtInput
                name='email'
                value={info?.email}
                placeholder='电子邮箱、手机号码至少填一项'
                placeholderClass='input-placeholder'
                onChange={(e) => handleChange('email', e)}
              />
            </SpCell>
            <SpCell title='手机号码'>
              <AtInput
                name='mobile'
                maxLength={11}
                value={info?.mobile}
                placeholder='电子邮箱、手机号码至少填一项'
                placeholderClass='input-placeholder'
                onChange={(e) => handleChange('mobile', e)}
              />
            </SpCell>
            <View className='invoice-box__bottom'></View>
          </View>
        </View>
      </ScrollView>
      <SpFloatLayout
        title='发票类型类型'
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
              <Text className='option-title'>普通发票</Text>
              <Text
                className={classNames('iconfont', {
                  'icon-roundcheckfill': info.invoice_type_code === '02',
                  'icon-round': info.invoice_type_code !== '02'
                })}
              />
              <Text className='option-electronic'>电子</Text>
            </View>
            <View className='option-desc'>
              增值税普通发票和数电发票均可作为交易凭证，用于企业报销
            </View>
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
                <Text className='option-title'>专用发票</Text>
                <Text
                  className={classNames('iconfont', {
                    'icon-roundcheckfill': info.invoice_type_code === '01',
                    'icon-round': info.invoice_type_code !== '01'
                  })}
                />
                <Text className='option-electronic'>电子</Text>
              </View>
              <View className='option-desc'>
                购买方为一般纳税人时，可申请增值税专用发票用于抵扣进项税额
              </View>
            </View>
          )}
        </View>
        <View className='invoice-type-tips'>
          您可结合需求选择普通/专用发票，专用发票在支付成功后可申请电子，纸质发票具备同等法律效力，电子更低碳环保
        </View>
      </SpFloatLayout>
    </SpPage>
  )
}

Invoice.options = {
  addGlobalClass: true
}

export default Invoice
