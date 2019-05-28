import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import { AtInputNumber } from 'taro-ui'
// import find from 'lodash/find'
import { Price } from '@/components'
import { classNames, log } from '@/utils'
import api from '@/api'

import './index.scss'

export default class GoodsBuyPanel extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null,
    isOpened: false,
    type: 'fastbuy',
    fastBuyText: '立即购买',
    busy: false,
    onClose: () => {},
    onChange: () => {},
    onClickAddCart: () => {},
    onClickFastBuy: () => {}
  }

  constructor (props) {
    super(props)

    this.state = {
      marketing: 'normal',
      selection: [],
      curSku: null,
      curImg: null,
      quantity: 1,
      isActive: props.isOpened
    }

    this.disabledSet = new Set()
  }

  componentDidMount () {
    const { info } = this.props
    const { spec_items } = info
    const marketing = info.group_activity
      ? 'group'
      : info.seckill_activity
        ? 'seckill'
        : 'normal'
    const skuDict = {}

    spec_items.forEach(t => {
      const key = t.item_spec.map(s => s.spec_value_id).join('_')
      const propsText = t.item_spec.map(s => s.spec_value_name).join(' ')
      t.propsText = propsText
      skuDict[key] = t
    })
    const selection = Array(info.item_spec_desc.length).fill(null)
    this.skuDict = skuDict
    this.setState({
      marketing,
      selection
    })

    if (!spec_items || !spec_items.length) {
      this.noSpecs = true
    }
  }

  componentWillReceiveProps (nextProps) {
    const { isOpened } = nextProps
    if (isOpened !== this.state.isActive) {
      this.setState({
        isActive: isOpened
      })
    }
  }

  getSkuProps = () => {
    const { info } = this.props
    if (!info) return ''

    const { curSku } = this.state
    let propsText = ''

    if (this.noSpecs) {
      return ''
    }

    if (!curSku) {
      return `请选择`
    }

    propsText = curSku.propsText
    return `已选 “${propsText}”`
  }

  calcDisabled (selection) {
    const skuDict = this.skuDict
    const disabledSet = new Set()
    const makeReg = (sel, row, val) => {
      const tSel = sel.slice()
      const regStr = tSel.map((s, idx) => row === idx
        ? val
        : !s ? '(\\d+)' : s
      ).join('_')

      return new RegExp(regStr)
    }

    const isNotDisabled = (sel, row, val) => {
      const reg = makeReg(sel, row, val)

      return Object.keys(skuDict).some(key => {
        return key.match(reg) && skuDict[key].store > 0
      })
    }

    const { info } = this.props
    for (let i = 0, l = info.item_spec_desc.length; i < l; i++) {
      const { spec_values } = info.item_spec_desc[i]
      for (let j = 0, k = spec_values.length; j < k; j++) {
        const id = spec_values[j].spec_value_id
        if (!disabledSet.has(id) && !isNotDisabled(selection, i, id)) {
          disabledSet.add(id)
        }
      }
    }

    this.disabledSet = disabledSet
  }

  getCurSkuImg (sku) {
    let img = this.props.info.pics[0]
    if (!sku) {
      return img
    }

    sku.item_spec.some(s => {
      if (s.spec_image_url) {
        img = s.spec_image_url
        return true
      }
    })
    return img
  }

  updateCurSku (selection) {
    selection = selection || this.state.selection
    this.calcDisabled(selection)
    if (selection.some(s => !s)) {
      this.setState({
        curSku: null,
        curImg: null
      })
      this.props.onChange(null)
      return
    }

    const curSku = this.skuDict[selection.join('_')]
    const curImg = this.getCurSkuImg(curSku)
    this.setState({
      curSku,
      curImg
    })

    this.props.onChange(curSku)
    log.debug('[goods-buy-panel] updateCurSku: ', curSku)
  }

  handleQuantityChange = (val) => {
    this.setState({
      quantity: val
    })
  }

  handleSelectSku = (item, idx) => {
    if (this.props.info.spec_items.length <= 1 || this.disabledSet.has(item.spec_value_id)) return

    const { selection } = this.state
    if (selection[idx] === item.spec_value_id) {
      selection[idx] = null
    } else {
      selection[idx] = item.spec_value_id
    }

    this.updateCurSku(selection)
    this.setState({
      selection
    })
  }

  toggleShow = (isActive) => {
    if (isActive === undefined) {
      isActive = !this.state.isActive
    }

    this.setState({ isActive })
    this.props.onClose && this.props.onClose()
  }

  handleBuyClick = async (type, skuInfo, num) => {
    const { marketing, info } = this.state
    const { item_id } = this.noSpecs ? info : skuInfo
    let url = `/pages/cart/espier-checkout`

    if (type === 'cart') {
      url = `/pages/cart/espier-index`

      try {
        await api.cart.add({
          item_id,
          num
        })
      } catch (e) {
        console.log(e)
      }

      Taro.showToast({
        title: '成功加入购物车',
        icon: 'success'
      })

      this.setState({
        busy: false
      })

      this.props.onAddCart(item_id, num)
    }


    if (type === 'fastbuy') {
      url += '?cart_type=fastbuy'
      if (marketing === 'group') {
        const { groups_activity_id } = info.group_activity
        url += `&type=${marketing}&group_id=${groups_activity_id}`
      } else if (marketing === 'seckill') {
        const { seckill_id } = info.seckill_activity
        const { ticket } = await api.item.seckillCheck({ item_id, seckill_id, num })
        url += `&type=${marketing}&seckill_id=${seckill_id}&ticket=${ticket}`
      }

      try {
        await api.cart.fastBuy({
          item_id,
          num
        })
      } catch (e) {
        console.log(e)
      }

      this.setState({
        busy: false
      })

      this.props.onFastbuy(item_id, num)
      Taro.navigateTo({
        url
      })
    }
  }

  render () {
    const { info, type, fastBuyText } = this.props
    const { curImg, quantity, selection, isActive, busy } = this.state
    if (!info) {
      return null
    }

    const curSku = this.noSpecs ? info : this.state.curSku
    const maxStore = +(curSku ? curSku.store : (info.store || 99999))
    const hasStore = curSku ? curSku.store > 0 : info.store > 0

    return (
      <View className={classNames('goods-buy-panel', isActive ? 'goods-buy-panel__active' : null)}>
        <View className='goods-buy-panel__overlay'></View>

        <View className='goods-buy-panel__wrap'>
          <View
            className='at-icon at-icon-close'
            onClick={() => this.toggleShow(false)}
          />
          <View className='goods-buy-panel__hd'>
            <View className='goods-img__wrap'>
              <Image
                className='goods-img'
                mode='aspectFill'
                src={curImg || info.pics[0]}
              />
            </View>
            <Price
              primary
              noSymbol
              appendText='元'
              value={curSku ? curSku.price : info.price}
            />
            <View className='goods-sku__info'>
              {
                // curSku && <Text className='goods-sku__stock'>库存{curSku.store}{info.unit}</Text>
              }
              {this.noSpecs
                ? (<Text className='goods-sku__props'>{info.item_name}</Text>)
                :(<Text className='goods-sku__props'>
                    <Text className='goods-sku__props-label'>选择规格</Text>
                    <Text>{curSku ? `已选择 ${curSku.propsText}` : '请选择'}</Text>
                  </Text>)
              }
            </View>
          </View>
          <View className='goods-buy-panel__bd'>
            <ScrollView
              className='goods-skus__wrap'
            >
              {
                info.item_spec_desc.map((spec, idx) => {
                  return (
                    <View
                      className='sku-item__group'
                      key={spec.spec_id}
                    >
                      {info.item_spec_desc.length > 1 && (<Text className='sku-item__group-hd'>{spec.spec_name}</Text>)}
                      <View className='sku-item__group-bd'>
                        {
                          spec.spec_values.map(sku => {
                            return (
                              <Text
                                className={classNames('sku-item', { 'is-active': sku.spec_value_id === selection[idx], 'is-disabled': this.disabledSet.has(sku.spec_value_id) })}
                                key={sku.spec_value_id}
                                onClick={this.handleSelectSku.bind(this, sku, idx)}
                              >{sku.spec_value_name}</Text>
                            )
                          })
                        }
                      </View>
                    </View>
                  )
                })
              }
            </ScrollView>
            <View className='goods-quantity__wrap'>
              <Text className='goods-quantity__hd'></Text>
              <View className='goods-quantity__bd'>
                <AtInputNumber
                  min={1}
                  max={maxStore}
                  value={quantity}
                  onChange={this.handleQuantityChange}
                />
              </View>
            </View>
          </View>
          <View className='goods-buy-panel__ft'>
            <View className='goods-buy-panel__btns'>
              {(type === 'cart' || type === 'all' && hasStore) && (
                <Button
                  loading={busy}
                  className={classNames('goods-buy-panel__btn btn-add-cart', { 'is-disabled': !curSku })}
                  onClick={this.handleBuyClick.bind(this, 'cart', curSku, quantity)}
                  disabled={Boolean(!curSku)}
                >添加至购物车</Button>
              )}
              {(type === 'fastbuy' || type === 'all' && hasStore) && (
                <Button
                  loading={busy}
                  className={classNames('goods-buy-panel__btn btn-fast-buy', { 'is-disabled': !curSku })}
                  onClick={this.handleBuyClick.bind(this, 'fastbuy', curSku, quantity)}
                  disabled={Boolean(!curSku)}
                >{fastBuyText}</Button>
              )}
              {!hasStore && (<Text>当前店铺无货</Text>)}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
