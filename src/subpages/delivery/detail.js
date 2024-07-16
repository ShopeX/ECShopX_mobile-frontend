import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, ScrollView, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpPage, SpImage, SpCustomPicker, SpCell } from '@/components'
import CompShippingInformation from './comps/comp-shipping-information'
import { ORDER_STATUS_INFO, PAYMENT_TYPE, ORDER_DADA_STATUS } from '@/consts'
import { AtButton } from 'taro-ui'
import api from '@/api'
import './detail.scss'

const initialConfigState = {
  information: {},
  list: [
    {
      title: '快递公司',
      selector: [{ label: '商家自配送', value: 'all', status: true }],
      extraText: '商家自配送',
      status: 'select'
    },
    {
      title: '配送员',
      selector: [{ label: '张三', value: 'all', status: true }],
      extraText: '张三',
      status: 'select'
    },
    {
      title: '配送员编号',
      selector: [{ label: 'erdh123', value: 'all', status: true }],
      extraText: 'erdh123',
      status: 'select'
    },
    {
      title: '配送员手机号',
      selector: [{ label: '13456789009', value: 'all', status: true }],
      extraText: '13456789009',
      status: 'select'
    },
    {
      title: '配送状态',
      selector: [
        { label: '全部业绩排行1', value: 'all', status: true },
        { label: '直推业绩排行2', value: 'lv1', status: false },
        { label: '间推业绩排行3', value: 'lv2', status: false }
      ],
      extraText: '全部业绩排行1',
      status: 'select'
    },
    {
      title: '配送备注',
      selector: '',
      extraText: '全部业绩排行1',
      status: 'textarea'
    },
    {
      title: '照片上传',
      selector: [],
      extraText: '全部业绩排行1',
      status: 'image'
    }
  ]
}

const Detail = () => {
  const [state, setState] = useImmer(initialConfigState)
  const { information, selector, list } = state

  useEffect(() => {
    // 获取个人信息
    feach()
  }, [])

  const feach = async () => {
    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })
    const res = await api.salesman.promoterInfo()
    setState((draft) => {
      draft.information = res
    })
    Taro.hideLoading()
  }

  const getTradeStatusIcon = () => {
    // if (info.receiptType == 'dada') { // 达达同城配，订单状态单独处理
    //   return `${ORDER_DADA_STATUS[info.dada?.dadaStatus]?.icon}.png` || ''
    // }

    // if (info.cancelStatus == 'WAIT_PROCESS') {
    //   return 'order_dengdai.png'
    // }
    // return `${ORDER_STATUS_INFO[info.orderStatus]?.icon}.png`
    return 'user_icon.png'
  }

  const getTradeStatusDesc = () => {
    // if (info.receiptType == 'dada') { // 达达同城配，订单状态单独处理
    //   return ORDER_DADA_STATUS[info.dada?.dadaStatus]?.msg
    // } else if (info.zitiStatus == 'PENDING') {
    //   return '等待核销'
    // } else if (info.deliveryStatus == 'PARTAIL') {
    //   return '部分商品已发货'
    // } else if (info.cancelStatus == 'WAIT_PROCESS') {
    //   return '订单取消，退款处理中'
    // } else {
    //   return ORDER_STATUS_INFO[info.orderStatus]?.msg
    // }
    return '等待发货'
  }

  const handleClickToEdit = () => {}

  const deliveryItem = (item) => {
    console.log(item, 'hhhhhhhh')
  }

  return (
    <SpPage className={classNames('page-detail')}>
      <ScrollView scrollY style='height: 100%;'>
        <View className='trade-status-desc-box'>
          <SpImage src={getTradeStatusIcon()} width={50} height={50} />
          <Text className='status-desc'>{getTradeStatusDesc()}</Text>
        </View>
        {/* {information.tradeList.map((item, index) => (
          <View className='trade-item-wrap' key={index}>
            <CompTradeItem info={item} />
          </View>
        ))} */}
        <View className='trade-item-wrap'>
          <SpCell title='下单时间' value='2023.02.3  1 12:12:12' />
          <SpCell title='交易时间' value='2023.02.3  1 12:12:12' />
          <SpCell title='发货时间' value='2023.02.3  1 12:12:12' />
          <SpCell title='订单编号' value='2023.02.3  1 12:12:12' />
          <SpCell title='交易单号' value='2023.02.3  1 12:12:12' />
          <SpCell title='交易流水号' value='2023.02.3  1 12:12:12' />
        </View>
        <View className='trade-item-wrap'>
          <CompShippingInformation selector={list} deliveryItem={deliveryItem} />
        </View>
      </ScrollView>
    </SpPage>
  )
}

Detail.options = {
  addGlobalClass: true
}

export default Detail
