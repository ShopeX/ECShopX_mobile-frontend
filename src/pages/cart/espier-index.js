import Taro, { useState, useEffect, useRouter } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtActionSheet, AtActionSheetItem, AtNoticebar } from 'taro-ui'
import {
  SpNote,
  TabBar,
  Loading,
  SpPrice,
  SpNavBar,
  GoodsItem,
  SpRecommend,
  SpLogin,
  SpDefault,
  SpTabs,
  SpTabsPane,
  SpImage,
  SpCheckboxNew
} from '@/components'
import {
  log,
  navigateTo,
  classNames,
  getThemeStyle,
  styleNames,
  isNavbar,
  entryLaunch
} from '@/utils'
import api from '@/api'
import S from '@/spx'
import { Tracker } from '@/service'
import entry from '@/utils/entry'
import { setPageTitle } from '@/utils/platform'
import { getDistributorId } from '@/utils/helper'
import { usePage } from '@/hooks'
import CartGoodsItem from './comps/cart-goodsitem'
import './espier-index.scss'

const tablist = [
  { title: '普通商品', icon: 'icon-putongshangpin-01', type: 'normal' },
  { title: '跨境商品', icon: 'icon-kuajingshangpin-01', type: 'cross' }
]

function CartIndex(props) {
  const [state, setState] = useState({
    current: 0,
    itemCount: 0
  })
  const [cartList, setCatList] = useState({
    valid_cart: [],
    invalid_cart: []
  })
  const [likeList, setLikeList] = useState([])
  const router = useRouter()
  const { current } = state
  const { valid_cart, invalid_cart } = cartList

  const isLogin = S.getAuthToken()

  useEffect(async () => {
    console.log('useEffect...')
    if (isLogin) {
      getCartList()
    }
  }, [state])

  useEffect(async () => {
    getLikeList()
  }, [])

  const getCartList = async () => {
    const { type = 'distributor' } = router.params
    const isOpenStore = entryLaunch.isOpenStore()
    let params = {
      shop_type: type,
      isNostores: isOpenStore ? 0 : 1
    }
    // 跨境
    if (current == 1) {
      params = {
        ...params,
        iscrossborder: 1
      }
    }
    Taro.showLoading()
    const { valid_cart = [], invalid_cart = [] } = await api.cart.get(params)
    const { item_count } = await api.cart.count({ shop_type: 'distributor' })
    Taro.hideLoading()
    setCatList({
      valid_cart,
      invalid_cart
    })
  }

  const getLikeList = async () => {
    const { list, total_count: total } = await api.cart.likeList({
      page: 1,
      pageSize: 10
    })
    setLikeList(list)
  }

  const onChangeSpTab = (current) => {
    setState({
      ...state,
      current
    })
  }

  const onChangeGoodsItemCheck = async (item, e) => {
    await api.cart.select({
      cart_id: item.cart_id,
      is_checked: e
    })
    getCartList()
  }

  const onChangeAllCheck = async (item, e) => {
    const cartIds = item.list.map((item) => item.cart_id)
    await api.cart.select({
      cart_id: cartIds,
      is_checked: e
    })
    getCartList()
  }

  /**
   * 删除购物车
   * @param {*} item
   */
  const onDeleteCartGoodsItem = async ({ cart_id }) => {
    const res = await Taro.showModal({
      title: '提示',
      content: '将当前商品移出购物车?',
      showCancel: true,
      cancel: '取消',
      cancelText: '取消',
      confirmText: '确认',
      confirmColor: getThemeStyle()['--color-primary']
    })
    if (!res.confirm) return
    await api.cart.del({ cart_id })
    getCartList()
  }

  return (
    <View
      className={classNames({
        'page-cart-index': true,
        'has-navbar': isNavbar,
        'has-loginbar': !isLogin
      })}
      style={styleNames(getThemeStyle())}
    >
      <SpNavBar title='购物车' leftIconType='chevron-left' fixed />
      {!isLogin && (
        <View className='login-header'>
          <View className='login-txt'>授权登录后同步购物车的商品</View>
          <SpLogin size='small' circle onChange={() => {}}>
            授权登录
          </SpLogin>
        </View>
      )}
      {isLogin && (
        <View>
          <SpTabs current={current} tablist={tablist} onChange={onChangeSpTab} />
          <View className='valid-cart-block'>
            {valid_cart.map((item, index) => {
              const allChecked = !item.list.find((item) => !item.is_checked)
              return (
                <View className='shop-cart-item' key={`shop-cart-item__${index}`}>
                  <View className='shop-cart-item-hd'>{item.shop_name}</View>
                  <View className='shop-cart-item-bd'>
                    <View className='shop-activity'></View>
                    {item.list.map((sitem, index) => (
                      <View className='cart-item-wrap' key={`cart-item-wrap__${index}`}>
                        <SpCheckboxNew
                          isChecked={sitem.is_checked}
                          onChange={onChangeGoodsItemCheck.bind(this, sitem)}
                        />
                        <CartGoodsItem
                          info={sitem}
                          onDelete={onDeleteCartGoodsItem.bind(this, sitem)}
                        />
                      </View>
                    ))}
                  </View>
                  <View className='shop-cart-item-ft'>
                    <View className='lf'>
                      <SpCheckboxNew
                        isChecked={allChecked}
                        label='全选'
                        onChange={onChangeAllCheck.bind(this, item)}
                      />
                    </View>
                    <View className='rg'>
                      <View className='total-price-wrap'>
                        合计：
                        <SpPrice className='total-pirce' value={item.total_fee / 100} />
                      </View>
                      <AtButton
                        className='btn-calc'
                        type='primary'
                        circle
                        disabled={item.cart_total_num == 0}
                      >
                        结算({item.cart_total_num})
                      </AtButton>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
          <View className='invalid-cart-block'></View>
        </View>
      )}

      {valid_cart.length == 0 && invalid_cart.length == 0 && (
        <SpDefault type='cart' message='购物车内暂无商品～'>
          <AtButton type='primary' circle onClick={navigateTo.bind(this, '/pages/index')}>
            去选购
          </AtButton>
        </SpDefault>
      )}

      {/* 猜你喜欢 */}
      {<SpRecommend className='recommend-block' info={likeList} />}
      <TabBar />
    </View>
  )
}

export default CartIndex
