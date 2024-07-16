import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, ScrollView } from '@tarojs/components'
import { classNames } from '@/utils'
import { SpPage, SpCustomPicker } from '@/components'
import CompShippingInformation from './comps/comp-shipping-information'
import { AtButton } from 'taro-ui'
import api from '@/api'
import './send-out-goods.scss'

const initialConfigState = {
  information: {},
  list: [
    {
      title: '快递公司',
      selector: [{ label: '商家自配送', value: 'all', status: true }],
      extraText: '商家自配送',
      status: 'input'
    },
    {
      title: '配送员',
      selector: [{ label: '张三', value: 'all', status: true }],
      extraText: '张三',
      status: 'input'
    },
    {
      title: '配送员编号',
      selector: [{ label: 'erdh123', value: 'all', status: true }],
      extraText: 'erdh123',
      status: 'input'
    },
    {
      title: '配送员手机号',
      selector: [{ label: '13456789009', value: 'all', status: true }],
      extraText: '13456789009',
      status: 'input'
    },
    {
      title: '配送状态',
      selector: [
        { label: '全部业绩排行1', value: 'all', status: true },
        { label: '直推业绩排行2', value: 'lv1', status: false },
        { label: '间推业绩排行3', value: 'lv2', status: false }
      ],
      extraText: '全部业绩排行1',
      status: 'input'
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

const SendOutGoods = () => {
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

  const handleClickToEdit = () => {}

  const deliveryItem = (item) => {
    console.log(item,'hhhhhhhh')
  }

  return (
    <SpPage
      className={classNames('page-send-out-goods')}
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleClickToEdit}>
            确认发货
          </AtButton>
        </View>
      }
    >
      <ScrollView scrollY style='height: 100%;'>
        {/* {information.tradeList.map((item, index) => (
          <View className='trade-item-wrap' key={index}>
            <CompTradeItem info={item} />
          </View>
        ))} */}
        <View className='trade-item-wrap'>
          <CompShippingInformation selector={list} deliveryItem={deliveryItem} />
        </View>
      </ScrollView>
    </SpPage>
  )
}

SendOutGoods.options = {
  addGlobalClass: true
}

export default SendOutGoods
