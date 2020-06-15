import Taro, { Component } from '@tarojs/taro'
import { AtAccordion, AtButton } from 'taro-ui'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { GoodsItem, SpCheckbox, GoodsBuyPanel } from '@/components'
import { classNames, formatTime, pickBy } from '@/utils'
import S from '@/spx'
import api from '@/api'
import { connect } from '@tarojs/redux'

import './package-item.scss';
@connect(({ cart }) => ({
  cart,
}), (dispatch) => ({
	onUpdateCartCount: (count) => dispatch({ type: 'cart/updateCount', payload: count })
}))
export default class PackageItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props)

    this.state = {
      list: [],
      mainItem: {},
      buyPanelType: null,
      showBuyPanel: false,
      packageTotalPrice: 0,
      curSku: null,
      curId: null,
      fromCheck: false,
      packagePrices: null,
      selection: new Set()
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { package_id } = this.props.info
    const { itemLists, main_item_id, main_item_price, package_price } = await api.item.packageDetail(package_id)
    const nList = pickBy(itemLists, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
      pics: 'pics',
      spec_items: 'spec_items',
      item_spec_desc: 'item_spec_desc',
      checked_spec: null,
      price: ({ package_price }) => (package_price/100).toFixed(2),
      market_price: ({ price }) => (price/100).toFixed(2)
    })

    this.setState({
      list: nList,
      packagePrices: package_price,
      mainItem: {
        id: main_item_id,
        price: main_item_price
      }
    })
  }

  handlePackageClick = (pid) => {
    const cur = this.props.current
    const { selection } = this.state
    if (cur !== pid) {
      this.setState({
        selection: new Set()
      })
    }
    this.props.onClick()
  }

  handleSelectionChange = (item, checked) => {
    const selection = this.state.selection
    if (!item.checked_spec && item.spec_items.length) {
      this.showBuyPanel(item, true)
      return
    }
    selection[checked ? 'add' : 'delete']((item.checked_spec && item.checked_spec.item_id) || item.item_id)
    this.setState({
      selection: new Set(selection)
    }, () => {
      this.countPackageTotal()
    })
  }

  handleSkuSelection = (data) => {
    this.showBuyPanel(data)
  }

  showBuyPanel = (data, fromCheck) => {
    console.log(!!fromCheck)
    const { curSku } = this.state
    this.setState({
      curSku: data,
      curId: data.item_id,
      showBuyPanel: true,
      buyPanelType: 'pick',
      fromCheck: !!fromCheck
    })
  }

  handleSpecSubmit = (res) => {
    const { curId, fromCheck } = this.state
    let { list } = this.state
    const idx = list.findIndex(item => item.item_id === curId)
    let checked = null
    if (list[idx].checked_spec) {
      checked = list[idx].checked_spec.item_id
    }
    Object.assign(list[idx], {checked_spec: res})

    this.setState({
      list,
      showBuyPanel: false
    })

    const selection = this.state.selection
    const id = [...selection].find(item => item === checked)

    if (id) {
      selection.delete(id, res.item_id)
      selection.add(res.item_id)
      this.setState({
        selection: new Set(selection)
      }, () => {
        this.countPackageTotal()
      })
    }

    if (fromCheck && !([...selection].find(n => res.item_id === n))) {
      selection.add(res.item_id)
      this.setState({
        selection: new Set(selection)
      }, () => {
        this.countPackageTotal()
      })
    }
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
    const packageId = this.props.current
    let id = ''
    if ( APP_PLATFORM === 'standard') {
      const { distributor_id } = Taro.getStorageSync('curStore')
      id = distributor_id
    } else {
      const { distributor_id }= this.props
      id = distributor_id
    }

    //const { distributor_id } = Taro.getStorageSync('curStore')
    // const { distributor_id }= this.props
    const query = {
      isAccumulate: false,
      item_id: mainItem.id,
      items_id: [...selection],
      num: 1,
      shop_type: 'distributor',
      activity_id: packageId,
      activity_type: 'package',
      distributor_id: id
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

	async fetchCartcount() {
    try {
      const { item_count } = await api.cart.count({shop_type: 'distributor'})
      this.props.onUpdateCartCount(item_count)
    } catch (e) {
      console.error(e)
    }
	}


  countPackageTotal () {
    const { selection, packagePrices, mainItem } = this.state
    let packageTotalPrice = 0
    const selected = [...selection]
    if (selected.length) {
      packageTotalPrice += Number(mainItem.price)
      selected.map(id => {
        packageTotalPrice += Number(packagePrices[id])
      })
    }
    this.setState({
      packageTotalPrice: (packageTotalPrice/100).toFixed(2)
    })
  }

  render () {
    const { info, onClick, current } = this.props
    if (!info) {
      return null
    }
    const { list, selection, packagePrice, curSku,showBuyPanel,buyPanelType } = this.state
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
            {
              list.map(item => {
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
                          checked={selection.has((item.checked_spec && item.checked_spec.item_id) || item.item_id)}
                          onChange={this.handleSelectionChange.bind(this, item)}
                        />
                      </View>
                    }
                    renderSpec={
                      <View
                        className='goods-item__sku'
                        style={item.spec_items.length ? '' : 'display: none;'}
                        onClick={this.handleSkuSelection.bind(this, item)}
                      >
                        <Text className='goods-item__sku-text'>{item.checked_spec ? item.checked_spec.propsText : '请选择规格'}</Text>
                        <Text className='icon-arrowDown'></Text>
                      </View>
                    }
                  />
                )
              })
            }
          </View>

          <View class="package-goods__item-footer">
            <View className='package-amount'>组合价：<Text className='amount-number'>¥{packageTotalPrice}</Text></View>
            <AtButton
              type='primary'
              className='package-add-cart'
              size='small'
              onClick={this.handleAddCart.bind(this)}
            >加入购物车</AtButton>
          </View>

          {
            (curSku && showBuyPanel) &&
              <GoodsBuyPanel
                info={curSku}
                type={buyPanelType}
                isOpened={showBuyPanel}
                onClose={() => this.setState({ showBuyPanel: false })}
                onSubmit={this.handleSpecSubmit.bind(this)}
              />
          }
        </AtAccordion>
        {
          current !== package_id &&
            <ScrollView
              className='package-goods__thumbnails'
              scrollX
              scrollWithAnimation
              >
              {
                list.map(item => {
                  return (
                    <Image
                      key={item.index}
                      className='package-goods__thumbnails-img'
                      mode='aspectFix'
                      src={item.pics[0]}
                    />
                  )
                })
              }
            </ScrollView>
        }
      </View>
    )
  }
}
