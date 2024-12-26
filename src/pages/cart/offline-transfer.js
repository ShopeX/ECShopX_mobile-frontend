import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, Switch, Text, Button, ScrollView, Picker } from '@tarojs/components'
import { AtInput, AtButton, AtTextarea } from 'taro-ui'
import { SpCell, SpPage, SpAddress, SpUpload, SpSearchInput } from '@/components'
import api from '@/api'
import { isWxWeb, showToast, formatDateTime } from '@/utils'
import S from '@/spx'
import { useNavigation } from '@/hooks'

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
  setting: {},
  totalFee: 0,
  submitLoading: false,
  listLength: 0,
  isOpened: false,
  accountList: [
    { label: '手机号', value: 'phone' },
    { label: '客户名称', value: 'custonmerName' }
  ]
}

function OfflineTransfer(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const colors = useSelector((state) => state.colors.current)
  const { params } = useRouter()

  const { info, accountList, submitLoading, totalFee, setting, isOpened } = state

  useEffect(() => {
    if (params.order_id) {
      fetchOrderDetail(params.order_id)
    }
  }, [params])

  const fetchOrderDetail = async (order_id) => {
    const { orderInfo } = await api.trade.detail(order_id)
    //获取收款账户列表
    const { list: _accountList, setting: _setting } = await api.trade.getAackaccountList()

    let _info,
      accountRes = {}
    // debugger
    if (params.has_check == 'true') {
      //编辑
      accountRes = await api.trade.getVoucher({ order_id })
      console.log('accountRes', accountRes)
      const {
        bank_account_name,
        bank_account_no,
        bank_name,
        china_ums_no,
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
    } else {
      //新增：取默认收款账户
      const defaultAccountItem = _accountList.find((item) => item.is_default == '1')
      _info = JSON.parse(JSON.stringify(info))
      ;['bank_account_name', 'bank_account_no', 'bank_name', 'china_ums_no'].forEach((item) => {
        _info[item] = defaultAccountItem[item]
      })
      _info.order_id = order_id
    }

    setState((draft) => {
      draft.totalFee = orderInfo.total_fee
      draft.accountList = _accountList
      draft.info = _info
      draft.setting = _setting
    })
  }

  const handleChange = (name, val, e) => {
    const _info = JSON.parse(JSON.stringify(info || {}))

    _info[name] = val
    console.log('---', name, val, e, _info)
    // debugger
    setState((draft) => {
      draft.info = _info
    })
  }

  const handleSubmit = async () => {
    const data = {
      ...info,
      pay_fee: totalFee
    }

    if (!data.bank_account_name) {
      return showToast('请输入收款户名')
    }

    // if (!data.pay_account_name) {
    //   return showToast('请输入付款用户名')
    // }

    // if (!data.pay_account_bank) {
    //   return showToast('请输入付款银行')
    // }

    // if (!data.pay_account_no) {
    //   return showToast('请输入付款卡号')
    // }

    if (!data.voucher_pic.length) {
      return showToast('请上传凭证')
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
          Taro.navigateBack()
        } else if(params.isDianwu){
          Taro.redirectTo({ url: `/subpages/dianwu/collection-result?order_id=${params.order_id}&pay_type=offline_pay` })
        } else {
          Taro.redirectTo({ url: `/subpages/trade/detail?order_id=${params.order_id}` })
        }
      }, 700)
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

  console.log('info', info)

  return (
    <SpPage
      className='page-address-edit'
      renderFooter={
        !params.onlyView && (
          <View className='btns'>
            <AtButton
              circle
              type='primary'
              loading={submitLoading}
              disabled={submitLoading}
              className='submit-btn'
              style={`background: ${colors.data[0].primary}; border-color: ${colors.data[0].primary}`}
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
          <View className='page-address-edit__form'>
            <View className='head-box'>
              <View className='head-box-title'>收款账号</View>
              <View className='head-box-subtitle'>{setting?.pay_tips}</View>
            </View>
            <SpCell className='logistics-no border-bottom required' title='收款户名'>
              <Picker
                mode='selector'
                rangeKey='bank_account_name'
                range={accountList}
                onChange={handleAccountChange}
              >
                <View
                  className='search-condition'
                  onClick={() => {
                    setState((draft) => {
                      draft.searchConditionVis = true
                    })
                  }}
                >
                  {info?.bank_account_name || (
                    <View className='placeholder-txt'>请选择收款户名</View>
                  )}
                </View>
              </Picker>
            </SpCell>

            <SpCell className='logistics-no border-bottom' title='银行账户'>
              <AtInput
                name='bank_account_no'
                value={info?.bank_account_no}
                placeholder='请输入银行账户'
                disabled
                onChange={(e) => handleChange('bank_account_no', e)}
              />
            </SpCell>
            <SpCell className='logistics-no border-bottom' title='开户银行'>
              <AtInput
                name='bank_name'
                value={info?.bank_name}
                placeholder='请输入开户银行'
                disabled
                onChange={(e) => handleChange('bank_name', e)}
              />
            </SpCell>
            <SpCell className='logistics-no' title='银联号'>
              <AtInput
                name='china_ums_no'
                value={info?.china_ums_no}
                placeholder='请输入银联号'
                disabled
                onChange={(e) => handleChange('china_ums_no', e)}
              />
            </SpCell>
          </View>

          <View className='page-address-edit__form'>
            <View className='head-box'>
              <View className='head-box-title'>付款信息</View>
              <View className='head-box-subtitle'>{setting?.pay_desc}</View>
            </View>
            {/* <SpCell className='logistics-no border-bottom required' title='付款用户名'>
              <AtInput
                name='pay_account_name'
                value={info?.pay_account_name}
                placeholder='请输入付款用户名'
                onChange={(e) => handleChange('pay_account_name', e)}
              />
            </SpCell>

            <SpCell className='logistics-no border-bottom required' title='付款银行'>
              <AtInput
                name='telephone'
                value={info?.pay_account_bank}
                placeholder='请输入付款银行'
                onChange={(e) => handleChange('pay_account_bank', e)}
              />
            </SpCell>
            <SpCell className='logistics-no border-bottom required' title='付款卡号'>
              <AtInput
                name='pay_account_no'
                value={info?.pay_account_no}
                placeholder='请输入付款卡号'
                onChange={(e) => handleChange('pay_account_no', e)}
              />
            </SpCell> */}

            <SpCell className='logistics-no border-bottom' title='订单编号'>
              <AtInput
                name='order_id'
                value={info?.order_id}
                placeholder='请输入订单编号'
                disabled
                onChange={(e) => handleChange('order_id', e)}
              />
            </SpCell>

            <SpCell className='logistics-no border-bottom' title='交易流水号'>
              <AtInput
                name='pay_sn'
                value={info?.pay_sn}
                placeholder='请输入交易流水号'
                onChange={(e) => handleChange('pay_sn', e)}
              />
            </SpCell>

            <SpCell className='logistics-no border-bottom' title='转账金额'>
              <AtInput
                name='totalFee'
                value={(totalFee / 100).toFixed(2)}
                placeholder='请输入转账金额'
                disabled
                onChange={(e) => handleChange('totalFee', e)}
              />
            </SpCell>
            <SpCell className='logistics-no border-bottom required' title='上传凭证图片'>
              <View>
                <SpUpload
                  value={info?.voucher_pic}
                  max={6}
                  onChange={(val) => {
                    handleChange('voucher_pic', val)
                  }}
                />
                <View className='pic-tips'>支持png、jpg、gif、jpeg格式</View>
              </View>
            </SpCell>

            <SpCell className='logistics-no' title='转账备注'>
              <AtInput
                name='transfer_remark'
                value={info?.transfer_remark}
                placeholder='请输入转账备注'
                onChange={(e) => handleChange('transfer_remark', e)}
              />
            </SpCell>
          </View>

          {info?.check_status == 2 && (
            <View className='page-address-edit__form'>
              <View className='head-box'>
                <View className='head-box-title'>审核信息</View>
              </View>
              <SpCell className='logistics-no border-bottom' title='审核状态'>
                审核拒绝
              </SpCell>
              <SpCell className='logistics-no border-bottom' title='审核备注'>
                {info?.remark}
              </SpCell>
              <SpCell className='logistics-no' title='审核时间'>
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
