import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpPage, SpScrollView, SpImage } from '@/components'
import { classNames } from '@/utils'
import CompGoods from './comps/comp-goods'
import CompGift from './comps/comp-gift'
import './pending-checkout.scss'

const initialState = {
  list: [
    {
      name: 1,
      showDetail: false,
      items: [
        { name: 'xxx1' },
        { name: 'xxx2' },
        { name: 'xxx3' },
        { name: 'xxx4' },
        { name: 'xxx1' },
        { name: 'xxx2' },
        { name: 'xxx3' },
        { name: 'xxx4' }
      ]
    },
    { name: 2, showDetail: false, items: [{ name: 'xxx1' }] },
    { name: 3, showDetail: false, items: [{ name: 'xxx1' }] },
    { name: 4, showDetail: false, items: [{ name: 'xxx1' }] }
  ]
}
function DianwuPendingCheckout(props) {
  const [state, setState] = useImmer(initialState)
  const { list } = state

  const toggleShowDetail = ({ showDetail }, index) => {
    setState((draft) => {
      draft.list[index].showDetail = !showDetail
    })
  }

  return (
    <SpPage className='page-dianwu-pending-checkout'>
      <SpScrollView className='pending-checkout-list'>
        {list.map((item, index) => (
          <View className='pending-checkout-item' key={`pending-checkout-item__${index}`}>
            <View className='checkoutitem-hd'>
              <View className='account'>
                账号：<Text className='account-value'>ZH12345678</Text>
              </View>
              <View className='create-time'>2022.08.08 12:00:00</View>
            </View>
            <View className='checkoutitem-bd'>
              <View className='user-info'>
                <SpImage width={70} height={70} circle />
                <View className='user-wrap'>
                  <View>
                    <Text className='name'>客户昵称</Text>
                    <Text className='mobile'>138****8888</Text>
                  </View>
                  <View className='vip'>白金会员</View>
                </View>
              </View>
              {!item.showDetail && (
                <View className='shousuo-detail'>
                  <View className='goods-list'>
                    <ScrollView className='goods-image-wrap' scrollX>
                      {item.items.map((goods, goods_index) => (
                        <SpImage
                          width={110}
                          height={110}
                          circle={8}
                          key={`goods-image__${goods_index}`}
                        />
                      ))}
                    </ScrollView>
                    <View className='total-num'>共88件商品</View>
                  </View>
                  <View className='gift-list'>
                    <View className='gift-tag'>赠品</View>
                    <View className='gift-name'>
                      我商品名我商品名我商品名最多只显示一行我商品名我商品名我商品名最多只显示一行
                    </View>
                    <View className='gift-more'>共9件赠品</View>
                  </View>
                </View>
              )}
              {item.showDetail && (
                <View className='expend-detail'>
                  <View className='goods-list'>
                    {item.items.map((goods, goods_index) => (
                      <CompGoods />
                    ))}
                  </View>
                  <View className='gift-list'>
                    {[1, 2, 3].map((item, index) => (
                      <CompGift />
                    ))}
                  </View>
                </View>
              )}
            </View>
            <View className='checkoutitem-ft'>
              <View
                className={classNames('btn-showdetial', {
                  'expended': item.showDetail
                })}
                onClick={toggleShowDetail.bind(this, item, index)}
              >
                {item.showDetail ? '收起明细' : '展开明细'}
                <Text className='iconfont icon-qianwang-01'></Text>
              </View>
              <View className='btn-actions'>
                <AtButton circle>删除</AtButton>
                <AtButton circle className='active-checkout'>
                  取单
                </AtButton>
              </View>
            </View>
          </View>
        ))}
      </SpScrollView>
    </SpPage>
  )
}

DianwuPendingCheckout.options = {
  addGlobalClass: true
}

export default DianwuPendingCheckout
