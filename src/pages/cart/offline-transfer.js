import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpCell, SpPage, SpUpload, SpImage, SpInput as AtInput } from '@/components'
import api from '@/api'
import { showToast, formatDateTime, classNames } from '@/utils'

import './offline-transfer.scss'

const initialState = {
  info: {
    order_id: '',
    bank_account_name: '',
    bank_account_no: '',
    bank_name: '',
    china_ums_no: '',
    pay_account_name: '',
    pay_account_bank: '',
    pay_account_no: '',
    pay_sn: '',
    transfer_remark: '',
    voucher_pic: []
  },
  accountId: '',
  setting: {},
  totalFee: 0,
  submitLoading: false,
  listLength: 0,
  accountList: []
}

function OfflineTransfer() {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const colors = useSelector((_state) => _state.colors.current)
  const { params } = useRouter()

  const { info, accountList, submitLoading, totalFee, setting, accountId } = state

  useEffect(() => {
    if (params.order_id) {
      fetchOrderDetail(params.order_id)
    }
  }, [params])

  const fetchOrderDetail = async (order_id) => {
    let _params = {}
    if (params.isDianwu) {
      const { userId } = Taro.getStorageSync('userinfo')
      _params = {
        isSalesmanPage: 1,
        promoter_user_id: userId
      }
    }

    const { orderInfo } = await api.trade.detail(order_id, _params)
    //获取收款账户列表
    const { list: _accountList, setting: _setting } = await api.trade.getAackaccountList()

    let _info,
      _accountId,
      accountRes = {}
    if (params.has_check == 'true') {
      //编辑
      accountRes = await api.trade.getVoucher({ order_id })
      console.log('accountRes', accountRes)
      const {
        bank_account_name,
        bank_account_no,
        bank_name,
        china_ums_no,
        bank_account_id,
        pay_account_name,
        pay_account_bank,
        pay_account_no,
        pay_sn,
        transfer_remark,
        voucher_pic,
        remark,
        update_time,
        check_status,
        id
      } = accountRes

      _info = {
        order_id,
        bank_account_name,
        bank_account_no,
        bank_name,
        china_ums_no,
        bank_account_id,
        pay_account_name,
        pay_account_bank,
        pay_account_no,
        pay_sn,
        transfer_remark,
        voucher_pic,
        remark,
        update_time,
        check_status,
        id
      }

      _accountId = bank_account_id
    } else {
      //新增：
      _info = JSON.parse(JSON.stringify(info))
      _info.order_id = order_id
      // 取默认收款账户
      const defaultAccountItem = _accountList.find((item) => item.is_default == '1')
      _accountId = defaultAccountItem.id
    }

    setState((draft) => {
      draft.totalFee = orderInfo.total_fee
      draft.accountList = _accountList
      draft.info = _info
      draft.setting = _setting
      draft.accountId = _accountId
    })
  }

  const handleChange = (name, val, e) => {
    const _info = JSON.parse(JSON.stringify(info || {}))

    _info[name] = val
    console.log('---', name, val, e, _info)
    setState((draft) => {
      draft.info = _info
    })
  }

  const handleSubmit = async () => {
    // const {bank_account_name, bank_account_no, bank_name, china_ums_no } = accountList.find(item=>item.id == accountId) ?? {}
    const data = {
      ...info,
      pay_fee: totalFee
      // bank_account_name,
      // bank_account_no,
      // bank_name,
      // china_ums_no
    }

    if (!accountId) {
      return showToast('请选择收款账户')
    }

    data.bank_account_id = accountId

    if (!data.voucher_pic.length) {
      return showToast('请上传凭证')
    }

    if (params.isDianwu) {
      const { userId } = Taro.getStorageSync('userinfo')
      data.isSalesmanPage = 1
      data.promoter_user_id = userId
    }

    console.log('参数', data)

    Taro.showLoading('正在提交')
    setState((draft) => {
      draft.submitLoading = true
    })
    try {
      if (params.has_check == 'true') {
        await api.trade.updateVoucher(data)
        showToast('修改成功')
      } else {
        await api.trade.uploadVoucher(data)
        showToast('上传成功')
      }
      setState((draft) => {
        draft.submitLoading = false
      })
      Taro.hideLoading()
      setTimeout(() => {
        if (params.isDetail) {
          Taro.eventCenter.trigger('onEventOfflineApply')
          Taro.eventCenter.trigger('onEventOrderStatusChange')
          Taro.navigateBack()
        } else if (params.isDianwu) {
          Taro.redirectTo({
            url: `/subpages/dianwu/collection-result?order_id=${params.order_id}&pay_type=offline_pay`
          })
        } else {
          Taro.redirectTo({ url: `/subpages/trade/detail?order_id=${params.order_id}` })
        }
      }, 1500)
    } catch (error) {
      if (!params.isDetail) {
        Taro.redirectTo({ url: `/subpages/trade/detail?order_id=${params.order_id}` })
      }

      Taro.hideLoading()
      setState((draft) => {
        draft.submitLoading = false
      })
    }
  }

  const handleAccountChange = (e) => {
    console.log(e.detail.value, accountList[e.detail.value])
    handleBatchAccount(accountList[e.detail.value])
  }

  const handleBatchAccount = (accountItem = {}) => {
    const nInfo = JSON.parse(JSON.stringify(info || {}))

    ;['bank_account_name', 'bank_account_no', 'bank_name', 'china_ums_no'].forEach((item) => {
      nInfo[item] = accountItem[item]
    })

    setState((draft) => {
      draft.info = nInfo
    })
  }

  const handleAccountItemClick = (idx) => {
    if (params.onlyView) return
    setState((draft) => {
      draft.accountId = accountList[idx]?.id
    })
  }

  const accountItemRender = (item, idx) => {
    return (
      <View
        key={item.idx}
        onClick={() => handleAccountItemClick(idx)}
        className={classNames('account-item', {
          'account-item-active': item.id == accountId && !params.isDianwu,
          'account-item-dianwu-active': item.id == accountId && params.isDianwu
        })}
      >
        <SpImage src={item.pic} width={90} height={90} mode='aspectFill' circle />
        <View className='account-item-content'>
          <View className='account-item-content-bank'>{item.bank_name}</View>
          <View className='account-item-content-name'>{item.bank_account_name}</View>
          <View className='account-item-content-no'>{item.bank_account_no}</View>
          <View className='account-item-content-no'>{item.china_ums_no}</View>
        </View>
      </View>
    )
  }

  console.log('info', info)

  return (
    <SpPage
      className='page-offline-transfer'
      renderFooter={
        !params.onlyView && (
          <View className='btns'>
            <AtButton
              circle
              loading={submitLoading}
              disabled={submitLoading}
              className={classNames('submit-btn', {
                'dianwu-primary': params.isDianwu,
                'normal-primary': !params.isDianwu
              })}
              onClick={handleSubmit}
            >
              提交凭证
            </AtButton>
          </View>
        )
      }
    >
      <ScrollView className='scroll-view-container'>
        <View className='scroll-view-body'>
          <View className='page-offline-transfer__form'>
            <View className='head-box '>
              <View className='head-box-title'>收款账号</View>
              <View className='head-box-subtitle'>{setting?.pay_tips}</View>
            </View>
            {accountList.length > 0 && accountList.map((item, idx) => accountItemRender(item, idx))}
          </View>

          <View className='page-offline-transfer__form'>
            <View className='head-box'>
              <View className='head-box-title'>付款信息</View>
              <View className='head-box-subtitle'>{setting?.pay_desc}</View>
            </View>
            {/* <SpCell className='offline-item border-bottom required' title='付款用户名'>
              <AtInput
                name='pay_account_name'
                value={info?.pay_account_name}
                placeholder='请输入付款用户名'
                onChange={(e) => handleChange('pay_account_name', e)}
              />
            </SpCell>

            <SpCell className='offline-item border-bottom required' title='付款银行'>
              <AtInput
                name='telephone'
                value={info?.pay_account_bank}
                placeholder='请输入付款银行'
                onChange={(e) => handleChange('pay_account_bank', e)}
              />
            </SpCell>
            <SpCell className='offline-item border-bottom required' title='付款卡号'>
              <AtInput
                name='pay_account_no'
                value={info?.pay_account_no}
                placeholder='请输入付款卡号'
                onChange={(e) => handleChange('pay_account_no', e)}
              />
            </SpCell> */}

            <SpCell className='offline-item border-bottom' title='订单编号'>
              {/* <AtInput
                name='order_id'
                value={info?.order_id}
                placeholder='请输入订单编号'
                disabled
                onChange={(e) => handleChange('order_id', e)}
              /> */}
              {info?.order_id}
            </SpCell>

            <SpCell className='offline-item border-bottom' title='交易流水号'>
              <AtInput
                name='pay_sn'
                value={info?.pay_sn}
                placeholder='请输入交易流水号'
                onChange={(e) => handleChange('pay_sn', e)}
              />
            </SpCell>

            <SpCell className='offline-item border-bottom' title='转账金额'>
              {/* <AtInput
                name='totalFee'
                value={(totalFee / 100).toFixed(2)}
                placeholder='请输入转账金额'
                disabled
                onChange={(e) => handleChange('totalFee', e)}
              /> */}
              {(totalFee / 100).toFixed(2)}
            </SpCell>
            <SpCell
              className='offline-item border-bottom offline-voucher-pc required'
              title='上传凭证图片'
            >
              <View>
                <View className='pic-tips'>支持png、jpg、gif、jpeg格式</View>

                {!params.onlyView && (
                  <SpUpload
                    value={info?.voucher_pic}
                    max={6}
                    onChange={(val) => {
                      handleChange('voucher_pic', val)
                    }}
                  />
                )}
                {params.onlyView && (
                  <View className='pic-box'>
                    {info?.voucher_pic.map((item, idx) => (
                      <SpImage
                        src={item}
                        width={180}
                        height={180}
                        key={idx}
                        className='pic-box-item'
                      />
                    ))}
                  </View>
                )}
              </View>
            </SpCell>

            <SpCell className='offline-item' title='转账备注'>
              <AtInput
                name='transfer_remark'
                value={info?.transfer_remark}
                placeholder='请输入转账备注'
                onChange={(e) => handleChange('transfer_remark', e)}
              />
            </SpCell>
          </View>

          {info?.check_status && (
            <View className='page-offline-transfer__form'>
              <View className='head-box'>
                <View className='head-box-title'>审核信息</View>
              </View>
              <SpCell className='offline-item border-bottom' title='审核状态'>
                {info?.check_status == 2 ? '审核拒绝' : '审核通过'}
              </SpCell>
              <SpCell className='offline-item border-bottom' title='审核备注'>
                {info?.remark}
              </SpCell>
              <SpCell className='offline-item' title='审核时间'>
                {formatDateTime(info?.update_time * 1000)}
              </SpCell>
            </View>
          )}
        </View>
      </ScrollView>
    </SpPage>
  )
}

OfflineTransfer.options = {
  addGlobalClass: true
}

export default OfflineTransfer
