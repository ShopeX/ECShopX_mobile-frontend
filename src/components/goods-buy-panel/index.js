import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import { AtInputNumber } from 'taro-ui'
import find from 'lodash/find'
import { Price } from '@/components'
import { classNames } from '@/utils'

import './index.scss'

export default class GoodsBuyPanel extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null,
    isOpened: false,
    onClose: () => {}
  }

  constructor (props) {
    super(props)

    this.state = {
      curSku: {
        'sku_id': 439,
        'item_id': 130,
        'price': '149.00',
        'store': 1000,
        'valid': true
      },
      quantity: 1,
      isActive: this.props.isOpened
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
    let propsText = ''

    if (!this.curSku) {
      propsText = info.spec.specs.map(s => s.spec_name).join(' ')
      return `请选择 ${propsText}`
    }

    propsText = this.curSku.split('_').map((sid, idx) => {
      const specs = info.spec.specs[idx]
      const v = find(specs.spec_values, s => sid === s.spec_value_id)
      return v.spec_value
    }).join(' ')

    return `选择了 ${propsText}`
  }

  handleQuantityChange = (val) => {
    this.setState({
      quantity: val
    })
  }

  handleSelectSku = (item) => {
    console.log(item)
  }

  toggleShow = (isActive) => {
    if (isActive === undefined) {
      isActive = !this.state.isActive
    }

    this.setState({ isActive })
    this.props.onClose && this.props.onClose()
  }

  render () {
    const { info } = this.props
    const { curSku, isActive } = this.state
    const skuProps = this.getSkuProps()

    if (!info) {
      return null
    }

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
                src={info.image_default_id}
              />
            </View>
            <Price
              primary
              value={curSku ? curSku.price : info.price}
            />
            <View className='goods-sku__info'>
              {
                curSku && <Text className='goods-sku__stock'>库存{curSku.store}{info.unit}</Text>
              }
              <Text className='goods-sku__props'>{skuProps}</Text>
            </View>
          </View>
          <View className='goods-buy-panel__bd'>
            <ScrollView
              className='goods-skus__wrap'
            >
              {
                info.spec.specs.map(spec => {
                  return (
                    <View
                      className='sku-item__group'
                      key={spec.spec_id}
                    >
                      <Text className='sku-item__group-hd'>{spec.spec_name}</Text>
                      <View className='sku-item__group-bd'>
                        {
                          spec.spec_values.map(sku => {
                            return (
                              <Text
                                className='sku-item'
                                key={sku.spec_value_id}
                                onClick={() => this.handleSelectSku(sku)}
                              >{sku.spec_value}</Text>
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
              <Text className='goods-quantity__hd'>型号</Text>
              <View className='goods-quantity__bd'>
                <AtInputNumber
                  min={1}
                  max={999999}
                  value={this.state.quantity}
                  onChange={this.handleQuantityChange}
                />
              </View>
            </View>
          </View>
          <View className='goods-buy-panel__ft'>
            <View className='goods-buy-panel__btns'>
              <Button className='goods-buy-panel__btn btn-add-cart'>加入购物车</Button>
              <Button className='goods-buy-panel__btn btn-fast-buy'>立即购买</Button>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
