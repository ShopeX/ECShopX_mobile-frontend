import React, { useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpPage, SpCell, SpImage, SpPrice } from '@/components'
import { classNames, entryLaunch, showToast, authSetting, validate } from '@/utils'
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
  const $router = useRouter()
  const { colorPrimary } = useSelector((state) => state.sys)
  const [state, setState] = useImmer(initialState)
  const { info, confirmInfo, isOpened } = state
  const { invoice_items = [] } = info
  useEffect(() => {
    entryLaunch.getRouteParams($router.params).then((params) => {
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
      showToast('请输入正确的电子邮箱')
      return
    }
    await api.trade.resendInvoice({
      id: data.id,
      confirm_email: data.email
    })
    showToast('重发成功')
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
        showToast('请打开保存图片权限')
      }
    )
  }

  const handleCancel = async () => {
    const { confirm } = await Taro.showModal({
      title: '提示',
      content: '确认撤销申请吗？',
      cancelText: '取消',
      confirmColor: colorPrimary,
      confirmText: '确认'
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
      'pending': '待开票',
      'inProgress': '开票中',
      'success': '开票成功',
      'failed': '已作废',
      'waste': '已作废'
    }
    return statusMap[info?.invoice_status] || info?.invoice_status
  }

  return (
    <SpPage
      className='invoice-detail'
      renderFooter={
        info?.invoice_status === 'success' || info?.invoice_status === 'pending' ? (
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
                重发至邮箱
              </View>
            )}

            {info?.invoice_status === 'pending' && (
              <View className='btn-wrap__item' onClick={() => handleCancel()}>
                撤销申请
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
                修改申请
              </View>
            )}

            {info?.invoice_status === 'success' && (
              <View
                className='btn-wrap__item'
                onClick={() => handleViewInvoice(info?.invoice_file_url)}
              >
                查看发票
              </View>
            )}
          </View>
        ) : null
      }
    >
      <ScrollView className='scroll-view-container' scrollY>
        <View className='invoice-detail__header'>
          <SpCell title='开票金额'>
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
            <SpCell title='发票类型' border>
              <Text className='invoice-detail__value'>
                {info?.invoice_type_code === '01' ? '专用发票' : '普通发票'}
              </Text>
            </SpCell>
          )}
          {info?.invoice_type === 'individual' && (
            <>
              <SpCell title='发票抬头' border>
                <Text className='invoice-detail__tag'>个人</Text>
                <Text className='invoice-detail__value'>{info?.company_title}</Text>
              </SpCell>
            </>
          )}
          {info?.invoice_type === 'enterprise' && (
            <>
              <SpCell title='发票抬头' border>
                <Text className='invoice-detail__tag company'>企业</Text>
                <Text className='invoice-detail__value'>{info?.company_title}</Text>
              </SpCell>
              <SpCell title='公司税号' border>
                <Text className='invoice-detail__value'>{info?.company_tax_number}</Text>
              </SpCell>
              <SpCell title='公司地址' border>
                <Text className='invoice-detail__value'>{info?.company_address}</Text>
              </SpCell>
              <SpCell title='公司电话' border>
                <Text className='invoice-detail__value'>{info?.company_telephone}</Text>
              </SpCell>
              <SpCell title='公司银行' border>
                <Text className='invoice-detail__value'>{info?.bank_name}</Text>
              </SpCell>
              <SpCell title='公司账号' border>
                <Text className='invoice-detail__value'>{info?.bank_account}</Text>
              </SpCell>
            </>
          )}
          <SpCell title='电子邮箱' border={false}>
            <Text className='invoice-detail__value'>{info?.email}</Text>
          </SpCell>
        </View>

        <View className='invoice-detail__section'>
          <View className='invoice-detail__title'>发票明细</View>
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
