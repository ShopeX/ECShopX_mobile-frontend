import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { classNames } from '@/utils'
import { SpPage, SpTime,SpCustomPicker } from '@/components'
import { useSyncCallback } from '@/hooks'
import api from '@/api'
import S from '@/spx'
import CompTabbar from './comps/comp-tabbar'

import './index.scss'

const initialConfigState = {
  funcList: [
    { name: '订单管理', icon: 'icon-dingdanguanli', path: '/subpages/delivery/list'},
    { name: '售后跟进', icon: 'icon-daikexiadan', path: '/subpages/delivery/after-sale-list'},
    {
      name: '配送业绩',
      icon: 'icon-yewuyuantuiguang',
      path: '/subpages/delivery/achievement'
    },
    { name: '服务商家', icon: 'icon-shangjialiebiao', path: '/subpages/delivery/selectShop'}
  ],
  codeStatus: false,
  information: { name: 'cx' },
  info: {},
  parameter: {
    datetype: 2,
    date: S.getNowDate(),
    distributor_id: ''
  },
  selector: []
}

const Index = () => {
  const [state, setState] = useImmer(initialConfigState)
  const { codeStatus, information, funcList, info, parameter, selector } = state

  useDidShow(() => {
    fetch()
    distributor()
  })

  const fetch = async () => {
    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })
    let params = {
      ...parameter,
      datetype: parameter.datetype == 0 ? 'y' : parameter.datetype == 1 ? 'm' : 'd'
    }
    const res = await api.salesman.getSalesmanCount(params)
    Taro.hideLoading()
    res.total_Fee = S.formatMoney(res.total_Fee / 100)
    res.refund_Fee = S.formatMoney(res.refund_Fee / 100)
    setState((draft) => {
      draft.info = res
    })
  }

  const distributor = async () => {
    const { list } = await api.salesman.getSalespersonSalemanShopList({
      page: 1,
      page_size: 1000
    })
    list.forEach((element) => {
      element.value = element.distributor_id
      element.label = element.name
    })
    list.unshift({
      value: '',
      label: '全部店铺'
    })
    setState((draft) => {
      draft.selector = list
    })
  }

  const handleCardClick = () => {
    // Taro.navigateTo({
    //   url: `/subpages/salesman/card`
    // })
    setState((draft) => {
      draft.codeStatus = true
    })
  }

  const handleFuncClick = (path) => {
    Taro.navigateTo({
      url: path
    })
  }

  const onTimeChange = (time, val) => {
    let params = {
      ...parameter,
      datetype: time,
      date: val
    }
    setState((draft) => {
      draft.parameter = params
    })
    handleRefresh()
  }

  const handleRefresh = useSyncCallback(() => {
    fetch()
  })

  const cancel = (index, val) => {
    let params = {
      ...parameter,
      distributor_id: val.value
    }
    setState((draft) => {
      draft.parameter = params
    })
    handleRefresh()
  }

  return (
    <SpPage className={classNames('page-sales-index')} renderFooter={<CompTabbar />}>
      <View className='sales-back'></View>
      <View className='sales-header'>
        <View className='sales-header-left'>
          <Text className='iconfont icon-yewuyuan sales-header-icon'></Text>
          <View className='sales-header-title'>配送员端</View>
        </View>
        {/* <View className='sales-header-left rigth' onClick={handleCardClick}>
          <Text className='iconfont icon-quanbu'></Text>
          <View className='sales-header-title'>会员码</View>
        </View> */}
      </View>
      <View className='sales-content'>
        <View className='sales-content-panel'>
          <View className='sales-content-panel-item'>
            <View className='panel-header'>
              <Text className='iconfont icon-gaikuang panel-header-icon'></Text>
              <View className='panel-header-title'>实时概况</View>
            </View>
            <View className='panel-headers'>
              <SpCustomPicker selector={selector} cancel={cancel} />
            </View>
          </View>
          <SpTime
            onTimeChange={onTimeChange}
            selects={parameter.datetype}
            nowTimeDa={parameter.date}
          />
          <View className='panel-content'>
            <View className='panel-content-top'>
              <View className='panel-content-top-title'>
                <View className='real-monet'>
                  <View className='panel-title  mb-0'>配送订单额（元）</View>
                  <Text className='iconfont icon-xianshi View-icon'></Text>
                </View>
                <View
                  className='look-detail'
                  onClick={() => {
                    Taro.navigateTo({
                      url: '/subpages/delivery/achievement'
                    })
                  }}
                >
                  查看数据总览&nbsp; &gt;
                </View>
              </View>
              <View className='panel-num mt-12'>{info.total_Fee}</View>
            </View>
            <View className='panel-content-btm'>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>配送订单量（单）</View>
                <View className='panel-num'>{info.order_num}</View>
              </View>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>配送费用（元）</View>
                <View className='panel-num'>{info.aftersales_num}</View>
              </View>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>退款（元）</View>
                <View className='panel-num'>{info.refund_Fee}</View>
              </View>
              <View className='panel-content-btm-item'>
                <View className='panel-title'>退款订单（笔）</View>
                <View className='panel-num'>{info.member_num}</View>
              </View>
            </View>
          </View>
        </View>

        <View className='sales-content-func'>
          <View className='func-title'>常用功能</View>
          <View className='func-content'>
            {funcList.map((item, index) => (
              <View
                className='func-content-item'
                onClick={() => handleFuncClick(item.path)}
                key={index}
              >
                <Text
                  className={classNames({
                    'iconfont': true,
                    [item.icon]: true,
                    'func-item-icon': true
                  })}
                ></Text>
                <View className='func-item-name'>{item.name}</View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SpPage>
  )
}

export default Index
