import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtAccordion, AtButton } from 'taro-ui'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { GoodsItem, SpCheckbox, GoodsBuyPanel } from '@/components'
import { pickBy } from '@/utils'
import S from '@/spx'
import api from '@/api'
import { connect } from 'react-redux'

import './package-item.scss'

@connect(
  ({ cart }) => ({
    cart
  }),
  (dispatch) => ({
    onUpdateCartCount: (count) => dispatch({ type: 'cart/updateCount', payload: count })
  })
)
export default class PackageItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    distributorId: 0
  }

  constructor (props) {
    super(props)

    this.state = {
      list: [],
      mainItem: {},
      buyPanelType: null,
      showBuyPanel: false,
      packageTotalPrice: 0,
      curSku: null,
      skuInfo: null,
      curId: null,
      fromCheck: false,
      packagePrices: null,
      mainPackagePrice: null,
      selection: new Set()
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { package_id } = this.props.info
    // const { itemLists, main_item_id, main_item_price, package_price } = await api.item.packageDetail(package_id)
    const res = await api.item.packageDetail(package_id)
    const { itemLists, mainItem, main_package_price, package_price: packagePrice } = res
    const nList = pickBy(itemLists, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
      pics: 'pics',
      store: 'store',
      distributor_id: 'distributor_id',
      spec_items: 'spec_items',
      item_spec_desc: 'item_spec_desc',
      checked_spec: null,
      price: ({ package_price }) => (package_price / 100).toFixed(2),
      market_price: ({ price }) => (price / 100).toFixed(2)
    })

    console.log(packagePrice, main_package_price, 66)

    const main_item = pickBy(mainItem, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
      pics: 'pics',
      store: 'store',
      spec_items: 'spec_items',
      item_spec_desc: 'item_spec_desc',
      distributor_id: 'distributor_id',
      checked_spec: null,
      price: ({ package_price }) => (package_price / 100).toFixed(2),
      market_price: ({ price }) => (price / 100).toFixed(2)
    })

    this.setState({
      list: nList,
      mainPackagePrice: main_package_price,
      packagePrices: packagePrice,
      mainItem: main_item
    })

    console.log(main_item, 89)
    if (main_item.spec_items && main_item.spec_items.length <= 1) {
      const selection = this.state.selection
      selection['add'](main_item.item_id)
      this.setState(
        {
          selection: new Set(selection)
        },
        () => {
          this.countPackageTotal()
        }
      )
    }
  }

  handlePackageClick = (pid) => {
    const cur = this.props.current
    if (cur !== pid) {
      const { list, mainItem } = this.state
      Object.assign(mainItem, { checked_spec: null })
      list.map((item) => {
        Object.assign(item, { checked_spec: null })
      })
      this.setState(
        {
          selection: new Set(),
          mainItem,
          list
        },
        () => {
          this.initMainPackage()
        }
      )
    }
    this.props.onClick()
  }

  initMainPackage = () => {
    const { mainItem } = this.state
    if (mainItem.spec_items && mainItem.spec_items.length <= 1) {
      const selection = this.state.selection
      selection['add'](mainItem.item_id)
      this.setState(
        {
          selection: new Set(selection)
        },
        () => {
          this.countPackageTotal()
        }
      )
    }
  }

  handleSelectionChange = (item, checked) => {
    const selection = this.state.selection
    if (!item.checked_spec && item.spec_items.length) {
      this.showBuyPanel(item, true)
      console.log(item, checked, 106)
      return
    }
    console.log(item, checked, 108)
    selection[checked ? 'add' : 'delete'](
      (item.checked_spec && item.checked_spec.item_id) || item.item_id
    )
    this.setState(
      {
        selection: new Set(selection)
      },
      () => {
        this.countPackageTotal()
      }
    )
  }

  handleMainSkuSelection = () => {
    this.showBuyPanel(this.state.mainItem, 'main')
  }

  handleSkuSelection = (data) => {
    this.showBuyPanel(data)
  }

  showBuyPanel = (data, fromCheck) => {
    this.setState({
      curSku: data,
      curId: data.item_id,
      showBuyPanel: true,
      buyPanelType: 'pick',
      fromCheck: fromCheck
    })
  }

  handleSpecClose = () => {
    this.setState({ showBuyPanel: false })
  }

  handleSpecSubmit = (res) => {
    const { curId, fromCheck } = this.state
    let { list, mainItem } = this.state
    let checked = null
    const selection = this.state.selection

    if (fromCheck === 'main') {
      if (mainItem.spec_items && mainItem.spec_items.length > 0) {
        mainItem.spec_items.map((spec_item) => {
          if (curId === spec_item.item_id) {
            Object.assign(mainItem, { checked_spec: res })
          }
        })
        if (mainItem.checked_spec && res.item_id === mainItem.checked_spec.item_id) {
          mainItem.price = this.state.mainPackagePrice[res.item_id].price / 100
          mainItem.market_price = this.state.mainPackagePrice[res.item_id].market_price / 100
        }
      }
      if (mainItem.spec_items && mainItem.spec_items.length > 1) {
        mainItem.spec_items.map((spec_item) => {
          selection['delete'](spec_item.item_id)
        })
      }
      selection['add'](res.item_id)
      this.setState(
        {
          selection: new Set(selection)
        },
        () => {
          this.countPackageTotal()
        }
      )
    } else {
      if (list.length > 0) {
        list.map((item) => {
          if (item.spec_items && item.spec_items.length > 0) {
            item.spec_items.map((spec_item) => {
              if (curId === spec_item.item_id) {
                Object.assign(item, { checked_spec: res })
              }
              if (spec_item.item_id === res.item_id) {
                item.price = this.state.packagePrices[res.item_id].price / 100
                item.market_price = this.state.packagePrices[res.item_id].market_price / 100
              }
            })
          }
          if (item.checked_spec) {
            checked = item.checked_spec.item_id
          }
          if (item.spec_items && item.spec_items.length > 1) {
            item.spec_items.map((spec_item) => {
              if (res.item_id === spec_item.item_id) {
                item.spec_items.map((del_item) => {
                  selection['delete'](del_item.item_id)
                })
              }
            })
          }
          selection['add'](res.item_id)
          this.setState(
            {
              selection: new Set(selection)
            },
            () => {
              this.countPackageTotal()
            }
          )
        })
      }
    }

    this.setState({
      list,
      mainItem,
      showBuyPanel: false
    })
  }

  handleAddCart = async () => {
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: '请先登录再购买',
        icon: 'none'
      })

      setTimeout(() => {
        S.login(this)
      }, 2000)

      return
    }

    const { selection, mainItem } = this.state
    console.log(selection, 198)
    console.log(mainItem, 'mainItemmainItemmainItem')
    // return
    const packageId = this.props.current
    if (!mainItem.checked_spec && mainItem.spec_items.length > 0) {
      Taro.showToast({
        title: '请选择主商品规格',
        icon: 'none'
      })
      return
    }
    const id = (mainItem.checked_spec && mainItem.checked_spec.item_id) || mainItem.item_id

    let item_selected = []
    const selected = [...selection]
    if (selected) {
      selected.map((item) => {
        if (item !== id) {
          item_selected.push(item)
        }
      })
    }

    const { distributorId } = this.props
    const query = {
      isAccumulate: false,
      item_id: id,
      items_id: item_selected,
      num: 1,
      shop_type: 'distributor',
      activity_id: packageId,
      activity_type: 'package',
      distributor_id: distributorId
    }
    const res = await api.cart.add(query)

    if (res) {
      Taro.showToast({
        title: '成功加入购物车',
        icon: 'success'
      })
      this.fetchCartcount()
    }
  }

  async fetchCartcount () {
    try {
      const { item_count } = await api.cart.count({ shop_type: 'distributor' })
      this.props.onUpdateCartCount(item_count)
    } catch (e) {
      console.error(e)
    }
  }

  countPackageTotal () {
    const { selection, packagePrices, mainPackagePrice } = this.state
    let packageTotalPrice = 0
    const selected = [...selection]
    console.log(selected, packagePrices, mainPackagePrice, 361)
    if (selected.length) {
      // packageTotalPrice += Number(mainItem.price * 100)
      selected.map((id) => {
        packageTotalPrice +=
          Number((packagePrices[id] && packagePrices[id].price) || 0) ||
          Number((mainPackagePrice[id] && mainPackagePrice[id].price) || 0)
      })
    }
    this.setState({
      packageTotalPrice: (packageTotalPrice / 100).toFixed(2)
    })
  }

  render () {
    const { info, onClick, current } = this.props
    if (!info) {
      return null
    }
    const {
      list,
      selection,
      packagePrice,
      skuInfo,
      curSku,
      showBuyPanel,
      buyPanelType,
      packageTotalPrice,
      packagePrices,
      mainPackagePrice,
      mainItem
    } = this.state

    console.log('===packageTotalPrice===', packageTotalPrice)

    const { package_id, package_name } = info
    return (
      <View>
        <AtAccordion
          open={current === package_id}
          onClick={this.handlePackageClick.bind(this, package_id)}
          isAnimation={false}
          title={package_name}
        >
          <View className='package-goods__list'>
            <View>主商品</View>
            <GoodsItem
              img-class='package-goods__item'
              showFav={false}
              showSku
              key={mainItem.item_id}
              info={mainItem}
              renderCheckbox={
                <View className='cart-item__act'>
                  <SpCheckbox key={mainItem.item_id} checked disabled />
                </View>
              }
              renderSpec={
                <View
                  className='goods-item__sku'
                  style={
                    mainItem.spec_items && mainItem.spec_items.length > 0 ? '' : 'display: none;'
                  }
                  onClick={this.handleMainSkuSelection.bind(this, mainItem)}
                >
                  <Text className='goods-item__sku-text'>
                    {mainItem.checked_spec ? mainItem.checked_spec.propsText : '请选择规格'}
                  </Text>
                  <Text className='iconfont icon-arrowDown'></Text>
                </View>
              }
            />
          </View>
          <View className='package-goods__list'>
            <View>组合商品</View>
            {list.map((item) => {
              return (
                <GoodsItem
                  img-class='package-goods__item'
                  showFav={false}
                  showSku
                  key={item.item_id}
                  info={item}
                  renderCheckbox={
                    <View className='cart-item__act'>
                      <SpCheckbox
                        key={item.item_id}
                        checked={selection.has(
                          (item.checked_spec && item.checked_spec.item_id) || item.item_id
                        )}
                        onChange={this.handleSelectionChange.bind(this, item)}
                      />
                    </View>
                  }
                  renderSpec={
                    <View
                      className='goods-item__sku'
                      style={item.spec_items.length > 0 ? '' : 'display: none;'}
                      onClick={this.handleSkuSelection.bind(this, item)}
                    >
                      <Text className='goods-item__sku-text'>
                        {item.checked_spec ? item.checked_spec.propsText : '请选择规格'}
                      </Text>
                      <Text className='iconfont icon-arrowDown'></Text>
                    </View>
                  }
                />
              )
            })}
          </View>

          <View className='package-goods__item-footer'>
            <View className='package-amount'>
              组合价：<Text className='amount-number'>¥{packageTotalPrice}</Text>
            </View>
            <AtButton
              className='package-add-cart'
              size='small'
              onClick={this.handleAddCart.bind(this)}
            >
              加入购物车
            </AtButton>
          </View>

          {curSku && showBuyPanel && (
            <GoodsBuyPanel
              info={curSku}
              isPackage='package'
              packItem={packagePrices}
              mainpackItem={mainPackagePrice}
              type={buyPanelType}
              isOpened={showBuyPanel}
              onClose={this.handleSpecClose.bind(this)}
              onSubmit={this.handleSpecSubmit.bind(this)}
            />
          )}
        </AtAccordion>
        {current !== package_id && (
          <ScrollView className='package-goods__thumbnails' scrollX scrollWithAnimation>
            {list.map((item) => {
              return (
                <Image
                  key={item.index}
                  className='package-goods__thumbnails-img'
                  mode='aspectFix'
                  src={item.pics[0]}
                />
              )
            })}
          </ScrollView>
        )}
      </View>
    )
  }
}
