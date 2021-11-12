import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import { GoodsItem } from '@/components'
import { classNames } from '@/utils'

import './checkout-items.scss'

export default class CheckoutItems extends Component {
  static defaultProps = {
    isOpened: false,
    list: [],
    onClickBack: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  render() {
    const { isOpened, list, onClickBack } = this.props

    return (
      <View className={classNames('checkout-items', isOpened ? 'checkout-items__active' : null)}>
        <AtNavBar
          leftIconType='chevron-left'
          title={`商品清单(${list.length})件`}
          onClickLeftIcon={onClickBack}
        />
        <ScrollView class='checkout-items__scroll'>
          <View className='checkout-items__list'>
            {list.map((item) => {
              return <GoodsItem key={item.item_id} info={item} />
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}
