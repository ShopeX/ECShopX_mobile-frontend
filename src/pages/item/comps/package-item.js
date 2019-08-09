import Taro, { Component } from '@tarojs/taro'
import { AtAccordion, AtButton } from 'taro-ui'
import { View, Text, Image } from '@tarojs/components'
import { GoodsItem, SpCheckbox } from '@/components'
import { classNames, formatTime, pickBy } from '@/utils'
import S from '@/spx'
import api from '@/api'

import './package-item.scss';

export default class PackageItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    onClick: () => {},
    onAddCart: () => {}
  }

  constructor(props) {
    super(props)

    this.state = {
      list: [],
      selection: new Set()
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { package_id } = this.props.info
    const { itemLists } = await api.item.packageDetail(package_id)
    const nList = pickBy(itemLists, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
      spec_items: 'spec_items',
      item_spec_desc: 'item_spec_desc',
      price: ({ price }) => (price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price/100).toFixed(2)
    })

    this.setState({
      list: nList
    })
  }

  handleSelectionChange = (id, checked) => {
    console.log(id)
    const selection = this.state.selection
    selection[checked ? 'add' : 'delete'](id)
    this.setState({
      selection: new Set(selection)
    })
    console.log(selection)
  }

  handleSkuPick = (data) => {
    this.props.onShowBuyPanel(data)
  }

  render () {
    const { info, onClick, current, onAddCart } = this.props
    if (!info) {
      return null
    }
    const { list, selection } = this.state
    const { package_id, package_name } = info

    return (
      <AtAccordion
        open={current === package_id}
        onClick={onClick}
        isAnimation={false}
        title={package_name}
      >
        <View className='package-goods__list'>
          {
            list.map(item => {
              return (
                <GoodsItem
                  classes='package-goods__item'
                  showFav={false}
                  showSku
                  key={item.item_id}
                  info={item}
                  renderCheckbox={
                    <View className='cart-item__act'>
                      <SpCheckbox
                        key={item.item_id}
                        checked={selection.has(item.item_id)}
                        onChange={this.handleSelectionChange.bind(this, item.item_id)}
                      />
                    </View>
                  }
                  renderSpec={
                    item.spec_items.length
                      ? <View
                          className='goods-item__sku'
                          onClick={this.handleSkuPick.bind(this, item)}
                        >
                          <Text>请选择</Text>
                          <Text className='icon-arrowDown'></Text>
                        </View>
                      : null
                  }
                />
              )
            })
          }
        </View>
        <View class="package-goods__item-footer">
          <View className='package-amount'>组合价：</View>
          <AtButton
            type='primary'
            className='package-add-cart'
            size='small'
            onClick={onAddCart}
          >加入购物车</AtButton>
        </View>
      </AtAccordion>
    )
  }
}
