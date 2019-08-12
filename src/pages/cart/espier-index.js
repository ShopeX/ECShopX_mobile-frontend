import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { SpCheckbox, SpNote, TabBar, Loading, Price, NavBar, GoodsItem } from '@/components'
import { log, navigateTo, pickBy, classNames } from '@/utils'
import debounce from 'lodash/debounce'
import api from '@/api'
import { withLogin, withPager } from '@/hocs'
import { getTotalPrice, getTotalCount } from '@/store/cart'
import CartItem from './comps/cart-item'

import './espier-index.scss'

@connect(({ cart }) => ({
  list: cart.list,
  cartIds: cart.cartIds,
  defaultAllSelect: false,
  totalPrice: getTotalPrice(cart),
  // workaround for none selection cartItem num change
  totalItems: getTotalCount(cart, true)
}), (dispatch) => ({
  onUpdateCartNum: (cart_id, num) => dispatch({ type: 'cart/updateNum', payload: { cart_id, num: +num } }),
  onUpdateCart: (list) => dispatch({ type: 'cart/update', payload: list }),
  onCartSelection: (selection) => dispatch({ type: 'cart/selection', payload: selection })
}))
@withPager
@withLogin()
export default class CartIndex extends Component {
  static defaultProps = {
    totalPrice: '0.00',
    list: null,
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      loading: true,
      selection: new Set(),
      cartMode: 'default',
      curPromotions: null,
      groups: [],
      likeList: [],
      invalidList: [],
      error: null
    }

    this.updating = false
    this.lastCartId = null
  }

  componentDidMount () {
    this.fetchCart((list) => {
      if (this.props.defaultAllSelect) {
        this.handleAllSelect(true)
      }
      const groups = this.resolveActivityGroup(list)
      let selection = []
      list.forEach(shopCart => {
        const checkedIds = shopCart.list
          .filter(t => t.is_checked)
          .map(t => t.cart_id)

        selection = [...selection, ...checkedIds]
      })
      this.updateSelection(selection)

      // this.props.list 此时为空数组
      setTimeout(() => {
        this.setState({
          groups,
          loading: false
        })
      }, 40)
    })

    this.nextPage()

  }

  componentDidShow () {
    if (this.state.loading) return
    this.updateCart()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.list !== this.props.list) {
      const groups = this.resolveActivityGroup(nextProps.list)
      this.setState({
        groups
      })
    }
  }

  handleClickItem = (item) => {
    const url = `/pages/item/espier-detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize
    }
    const { list, total_count: total } = await api.cart.likeList(query)

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
    })

    this.setState({
      likeList: [...this.state.likeList, ...nList],
    })

    return {
      total
    }
  }

  // 活动分组
  resolveActivityGroup (cartList) {
    const groups = cartList.map(shopCart => {
      const { list, used_activity = [] } = shopCart
      const tDict = list.reduce((acc, val) => {
        acc[val.cart_id] = val
        return acc
			}, {})
      const activityGrouping = shopCart.activity_grouping
      const group = used_activity.map((act) => {
        const activity = activityGrouping.find(a => String(a.activity_id) === String(act.activity_id))
        const itemList = activity.cart_ids.map(id => {
          const cartItem = tDict[id]
          delete tDict[id]
          return cartItem
				})
								
        return Object.assign(shopCart,{activity,list: itemList})
      })

      // 无活动列表
			group.push(Object.assign(shopCart,{activity: null, list: Object.values(tDict) }))

      return group
    })
    return groups
  }

  processCart ({ valid_cart = [], invalid_cart = [] }) {
    const list = valid_cart.map(shopCart => {
      const tList = this.transformCartList(shopCart.list)
      return {
        ...shopCart,
        list: tList
      }
    })

    const invalidList = this.transformCartList(invalid_cart)
    this.setState({
      invalidList
    })

    log.debug('[cart fetchCart]', list)
    this.props.onUpdateCart(list)

    return list
  }

  async fetchCart (cb) {
    let valid_cart = [], invalid_cart = []
    const { type = 'distributor' } = this.$router.params
    const params = {shop_type: type}
    try {
			// const res = await api.cart.get(params)
			const res = {
				"invalid_cart":[
						{
								"cart_id":"183",
								"company_id":"1",
								"user_id":"6",
								"user_ident":null,
								"shop_type":"distributor",
								"shop_id":"4",
								"activity_type":"normal",
								"activity_id":null,
								"marketing_type":null,
								"marketing_id":null,
								"item_type":"normal",
								"item_id":"99",
								"items_id":[

								],
								"item_name":"测试商品26",
								"pics":"http://mmbiz.qpic.cn/mmbiz_png/MUQsdY0GdK5ae4n1MtSjK0aksB7yCoufslMJhO5zyE0PRUdYElo6CSicOnJEbkpnbvHtfdd39LVtknSdMEFpOHQ/0?wx_fmt=png",
								"price":1,
								"num":1,
								"wxa_appid":null,
								"is_checked":false,
								"is_plus_buy":false,
								"created":1565507373,
								"updated":1565507373
						},
						{
								"cart_id":"182",
								"company_id":"1",
								"user_id":"6",
								"user_ident":null,
								"shop_type":"distributor",
								"shop_id":"4",
								"activity_type":"normal",
								"activity_id":null,
								"marketing_type":null,
								"marketing_id":null,
								"item_type":"normal",
								"item_id":"98",
								"items_id":[

								],
								"item_name":"测试商品25",
								"pics":"http://mmbiz.qpic.cn/mmbiz_png/MUQsdY0GdK5ae4n1MtSjK0aksB7yCoufNBh17xk9Vq1dR5Vuh6vv9EEt61rKKv2DjW40VGV5JFOic77XyurzNsA/0?wx_fmt=png",
								"price":100,
								"num":1,
								"wxa_appid":null,
								"is_checked":false,
								"is_plus_buy":false,
								"created":1565497994,
								"updated":1565497994
						},
						{
								"cart_id":"161",
								"company_id":"1",
								"user_id":"6",
								"user_ident":null,
								"shop_type":"distributor",
								"shop_id":"4",
								"activity_type":"normal",
								"activity_id":null,
								"marketing_type":null,
								"marketing_id":null,
								"item_type":"normal",
								"item_id":"100",
								"items_id":[

								],
								"item_name":" 云南白药 云丰 蒲地蓝消炎片 48片（消肿 咽炎 扁桃腺炎",
								"pics":"http://bbctest.aixue7.com/1/2019/07/09/8400174a0ba5e5b3577e719196cf5c1chvjL9AZcwdtqZ8dujNNxqGLoaCTfYpBR",
								"price":10000,
								"num":3,
								"wxa_appid":null,
								"is_checked":false,
								"is_plus_buy":false,
								"created":1565348713,
								"updated":1565348748
						}
				],
				"valid_cart":[
								{
										"shop_name":"怡康医药·广电智慧社区大兴东路店",
										"address":"安市莲湖区永安路9号龙湖水晶郦城",
										"shop_id":"4",
										"cart_total_price":100,
										"item_fee":100,
										"cart_total_num":1,
										"cart_total_count":1,
										"discount_fee":0,
										"total_fee":"100",
										"list":[
												{
														"cart_id":"184",
														"company_id":"1",
														"user_id":"6",
														"user_ident":null,
														"shop_type":"distributor",
														"shop_id":"4",
														"activity_type":"normal",
														"activity_id":null,
														"marketing_type":null,
														"marketing_id":null,
														"item_type":"normal",
														"item_id":"207",
														"items_id":[
		
														],
														"item_name":"yao072901",
														"pics":"http://mmbiz.qpic.cn/mmbiz_jpg/MUQsdY0GdK4avNsaHHwqSumaBer5LDj0oWwuebbnzibRsgcickolK72CzfGArmp80LLgmibFov5dfTMwTwoMFtQqw/0?wx_fmt=jpeg",
														"price":100,
														"num":1,
														"wxa_appid":null,
														"is_checked":true,
														"is_plus_buy":false,
														"created":1565540165,
														"updated":1565540165,
														"is_last_price":true,
														"discount_fee":0,
														"total_fee":"100",
														"store":221,
														"market_price":100,
														"brief":"072901",
														"approve_status":"onsale",
														"item_spec_desc":"颜色:绿",
														"parent_id":0,
														"limitedTimeSaleAct":{
																"activity_id":"5",
																"marketing_type":"limited_time_sale",
																"marketing_name":"测试活动",
																"limit_total_money":200,
																"limit_money":1,
																"validity_period":15,
																"is_free_shipping":false,
																"third_params":null,
																"promotion_tag":"限时优惠"
														},
														"total_price":"100"
												}
										],
										"used_activity":[
		
										],
										"used_activity_ids":[
		
										],
										"activity_grouping":[
		
										],
										"vipgrade_guide_title":{
												"guide_title_desc":""
										}
								},
								{
										"shop_id":"0",
										"cart_total_price":0,
										"item_fee":0,
										"cart_total_num":0,
										"cart_total_count":0,
										"discount_fee":0,
										"total_fee":0,
										"list":[
												{
														"cart_id":"179",
														"company_id":"1",
														"user_id":"6",
														"user_ident":null,
														"shop_type":"distributor",
														"shop_id":"0",
														"activity_type":"normal",
														"activity_id":null,
														"marketing_type":null,
														"marketing_id":null,
														"item_type":"normal",
														"item_id":"213",
														"items_id":[
		
														],
														"item_name":"兔兔5",
														"pics":"http://mmbiz.qpic.cn/mmbiz_jpg/MUQsdY0GdK7oJEMdx5fIyCIXwHkpN5ovseyoDNFo6ZiaicRJaPIyx3diaibjlia8JangYlLZMoLHpC5YTibbAqpAmHBg/0?wx_fmt=jpeg",
														"price":"1",
														"num":1,
														"wxa_appid":null,
														"is_checked":false,
														"is_plus_buy":false,
														"created":1565496251,
														"updated":1565496251,
														"is_last_price":false,
														"discount_fee":0,
														"total_fee":1,
														"store":96,
														"market_price":0,
														"brief":"",
														"approve_status":"onsale",
														"item_spec_desc":"",
														"parent_id":0,
														"original_price":1,
														"discount_price":0,
														"grade_name":"高级会员",
														"discount_desc":"",
														"total_price":"1"
												},
												{
														"cart_id":"178",
														"company_id":"1",
														"user_id":"6",
														"user_ident":null,
														"shop_type":"distributor",
														"shop_id":"0",
														"activity_type":"normal",
														"activity_id":null,
														"marketing_type":null,
														"marketing_id":null,
														"item_type":"normal",
														"item_id":"212",
														"items_id":[
		
														],
														"item_name":"兔兔4",
														"pics":"http://mmbiz.qpic.cn/mmbiz_png/MUQsdY0GdK5RFlB9L9G7RAp9MD1iaCIqa7gcuY6cKaicg0v8xvrUGMtYkxhtNkpXOJaE6zYw48JD7xad39nicGmZw/0?wx_fmt=png",
														"price":"1",
														"num":1,
														"wxa_appid":null,
														"is_checked":false,
														"is_plus_buy":false,
														"created":1565495984,
														"updated":1565496050,
														"is_last_price":false,
														"discount_fee":0,
														"total_fee":1,
														"store":97,
														"market_price":0,
														"brief":"",
														"approve_status":"onsale",
														"item_spec_desc":"",
														"parent_id":0,
														"original_price":1,
														"discount_price":0,
														"grade_name":"高级会员",
														"discount_desc":"",
														"total_price":"1"
												},
												{
														"cart_id":"177",
														"company_id":"1",
														"user_id":"6",
														"user_ident":null,
														"shop_type":"distributor",
														"shop_id":"0",
														"activity_type":"normal",
														"activity_id":null,
														"marketing_type":null,
														"marketing_id":null,
														"item_type":"normal",
														"item_id":"118",
														"items_id":[
		
														],
														"item_name":"兔兔1 有规格",
														"pics":"http://mmbiz.qpic.cn/mmbiz_jpg/MUQsdY0GdK7UY4x0PKJXNwsFp6Cic9RXsXOQszthYBhUibEEXOLHCNzwFBVZpMHqBHUQR2Wwjd0ftFia5sC0Wwv8g/0?wx_fmt=jpeg",
														"price":"500",
														"num":1,
														"wxa_appid":null,
														"is_checked":false,
														"is_plus_buy":false,
														"created":1565495559,
														"updated":1565495559,
														"is_last_price":false,
														"discount_fee":0,
														"total_fee":500,
														"store":92,
														"market_price":0,
														"brief":"",
														"approve_status":"onsale",
														"item_spec_desc":"100cm大图:aaa,200cm大图:一",
														"parent_id":0,
														"original_price":500,
														"discount_price":0,
														"grade_name":"高级会员",
														"discount_desc":"加入svip立省1元",
														"total_price":"500"
												},
												{
														"cart_id":"175",
														"company_id":"1",
														"user_id":"6",
														"user_ident":null,
														"shop_type":"distributor",
														"shop_id":"0",
														"activity_type":"normal",
														"activity_id":null,
														"marketing_type":null,
														"marketing_id":null,
														"item_type":"normal",
														"item_id":"134",
														"items_id":[
		
														],
														"item_name":"兔兔3",
														"pics":"http://mmbiz.qpic.cn/mmbiz_jpg/MUQsdY0GdK5ae4n1MtSjK0aksB7yCoufgw0qmw3TGmiarsWAViaZNn0bx2GaFIia50pkWkTl16kB80URxibt3ubOyg/0?wx_fmt=jpeg",
														"price":"2000",
														"num":3,
														"wxa_appid":null,
														"is_checked":false,
														"is_plus_buy":false,
														"created":1565494811,
														"updated":1565498543,
														"is_last_price":false,
														"discount_fee":0,
														"total_fee":6000,
														"store":97,
														"market_price":0,
														"brief":"",
														"approve_status":"onsale",
														"item_spec_desc":"",
														"parent_id":0,
														"original_price":2000,
														"discount_price":0,
														"grade_name":"高级会员",
														"discount_desc":"加入svip立省12元",
														"total_price":"6000"
												}
										],
										"used_activity":[
		
										],
										"used_activity_ids":[
		
										],
										"activity_grouping":[
		
										],
										"vipgrade_guide_title":{
												"guide_title_desc":"是是是"
										}
								}
						]				
		}
		console.log('res',res)
      valid_cart = res.valid_cart || valid_cart
      invalid_cart = res.invalid_cart || invalid_cart
    } catch (e) {
      this.setState({
        error: e
      })
    }

    const list = this.processCart({
      valid_cart,
      invalid_cart
    })
    cb && cb(list)
  }

  updateCart = async () => {
    Taro.showLoading({
      mask: true
    })
    this.updating = true
    try {
      await this.fetchCart()
    } catch (e) {
      console.log(e)
    }
    this.updating = false
    Taro.hideLoading()
  }

  asyncUpdateCart = debounce(async () => {
    await this.updateCart()
  }, 300)

  get isTotalChecked () {
    return this.props.cartIds.length === this.state.selection.size
  }

  toggleCartMode = () => {
    const cartMode = this.state.cartMode !== 'edit' ? 'edit' : 'default'
    this.setState({
      cartMode
    })
  }

  updateSelection (selection = []) {
    this.setState({
      selection: new Set(selection)
    })

    this.props.onCartSelection(selection)
  }

  async handleSelectionChange (cart_id, checked) {
    const selection = this.state.selection
    selection[checked ? 'add' : 'delete'](cart_id)
    this.updateSelection([...selection])

    await api.cart.select({
      cart_id,
      is_checked: checked
    })

    log.debug(`[cart change] item: ${cart_id}, selection:`, selection)
    this.updateCart()
  }

  handleDelect = async (cart_id) => {
    const res = await Taro.showModal({
      title: '将当前商品移出购物车?',
      showCancel: true,
      cancel: '取消',
      confirmText: '确认',
      confirmColor: '#0b4137'
    })
    if (!res.confirm) return

    await api.cart.del({ cart_id })

    const cartIds = this.props.cartIds.filter(t => t !== cart_id)

    this.updateSelection(cartIds)
    this.updateCart()
  }

  async changeCartNum (item_id, num) {
    const { type = 'distributor' } = this.$router.params
    // this.updateCart.cancel()
    const res = await api.cart.updateNum(item_id, num, type)
    this.processCart(res)
    // this.updateCart()
  }

  handleQuantityChange = async (item, num, e) => {
    e.stopPropagation()

    const { item_id, cart_id } = item
    Taro.showLoading({
      mask: true
    })

    this.props.onUpdateCartNum(cart_id, num)
    await this.changeCartNum(item_id, num)
    Taro.hideLoading()
    // this.updateCart.cancel()

    // if (this.lastCartId === cart_id || this.lastCartId === undefined) {
    //   await this.debounceChangeCartNum(cart_id, num)
    // } else {
    //   this.lastCartId = cart_id
    //   await this.changeCartNum(cart_id, num)
    // }
  }

  handleAllSelect = async (checked) => {
    const { selection } = this.state
    const { cartIds } = this.props

    if (checked) {
      cartIds.forEach(cartId => selection.add(cartId))
    } else {
      selection.clear()
    }

    Taro.showLoading()
    try {
      await api.cart.select({
        cart_id: cartIds,
        is_checked: checked
      })
    } catch (e) {
      console.log(e)
    }
    Taro.hideLoading()
    this.updateSelection([...selection])
  }

  handleClickPromotion = (cart_id, e) => {
    this.isTodetail = 0
    let promotions
    this.props.list.some((cart) => {
      cart.list.some(item => {
        if (item.cart_id === cart_id) {
          promotions = item.promotions.slice()
        }
      })
    })

    this.setState({
      curPromotions: promotions
    },() =>{
      this.isTodetail = 1
    })
  }

  handleClickToDetail = (item_id) => {
    if(this.isTodetail === 0){
      return false
    }
    this.isTodetail = 1
    Taro.navigateTo({
      url: `/pages/item/espier-detail?id=${item_id}`
    })
  }

  handleSelectPromotion = async (item) => {
    const { marketing_id: activity_id, cart_id } = item
    Taro.showLoading({
      mask: true
    })
    this.setState({
      curPromotions: null
    })
    await api.cart.updatePromotion({
      activity_id,
      cart_id
    })
    await this.fetchCart()
    Taro.hideLoading()
  }

  handleClosePromotions = () => {
    this.setState({
      curPromotions: null
    })
  }

  handleCheckout = () => {
    const { type } = this.$router.params
    if (this.updating) {
      Taro.showToast({
        title: '正在计算价格，请稍后',
        icon: 'none'
      })
      return
    }

    Taro.navigateTo({
      url: `/pages/cart/espier-checkout?cart_type=cart&type=${type}`
    })
  }



  transformCartList (list) {
    return pickBy(list, {
      item_id: 'item_id',
      cart_id: 'cart_id',
      activity_id: 'activity_id',
      title: 'item_name',
      desc: 'brief',
      is_checked: 'is_checked',
      store: 'store',
      curSymbol: 'cur.symbol',
      promotions: ({ promotions = [], cart_id }) => promotions.map(p => {
        p.cart_id = cart_id
        return p
      }),
      img: ({ pics }) => pics,
      price: ({ price }) => (+price / 100).toFixed(2),
      market_price: ({ market_price }) => (+market_price / 100).toFixed(2),
      num: 'num'
    })
  }

  navigateTo = (...args) => {
    navigateTo.apply(this, args)
  }

  render () {
    const { selection, groups, invalidList, cartMode, loading, curPromotions, likeList, page } = this.state
    const { totalPrice, list } = this.props

    if (loading) {
      return <Loading />
    }
    const { type = 'distributor' } = this.$router.params
    const isDrug = type === 'drug'
    const totalSelection = selection.size
    const totalItems = totalSelection
    const isEmpty = !list.length
		console.log('groups',groups)
    return (
      <View className={classNames('page-cart-index', isDrug && 'is-drug')}>
        <NavBar
          title='购物车'
          leftIconType='chevron-left'
          fixed='true'
        />

        <ScrollView
          className={`${isEmpty ? 'hidden-scroll' : 'cart-list__scroll'}`}
          onScrollToLower={this.nextPage}
          scrollY
        >
          {
            // !isEmpty && (
            //   <View className='cart-list__actions'>
            //     <Text
            //       clasName='btn-cart-mode'
            //       onClick={this.toggleCartMode}
            //     >{cartMode === 'edit' ? '完成' : '编辑'}</Text>
            //   </View>
            // )
          }
          <View className='cart-list'>
            {
							
              groups.map((activityGroup, idx) => {

								console.log(1111,{activityGroup})
                return (
                  <View
                    className='cart-list__shop'
                    key={idx}
									>
                    {
                      activityGroup.map(shopCart => {
												console.log(2222,shopCart)
                        const { activity } = shopCart

												
                        return shopCart.list.length > 0 && (
                          <View
                            className='cart-group'
                            key={shopCart.shop_id}
													>
													<Text>{shopCart.shop_name}</Text>
                            {activity && (
                              <View className='cart-group__activity'>
                                <View
                                  className='cart-group__activity-item'
                                >
                                  <Text className='cart-group__activity-label'>{activity.activity_tag}</Text>
                                  <Text>{activity.activity_name}</Text>
                                </View>
                              </View>
                            )}
                            {
                              shopCart.list.map((item) => {
                                return (
                                  <CartItem
                                    key={item.cart_id}
                                    info={item}
                                    onNumChange={this.handleQuantityChange.bind(this, item)}
                                    onClickPromotion={this.handleClickPromotion.bind(this, item.cart_id)}
                                    onClickImgAndTitle={this.handleClickToDetail.bind(this, item.item_id)}
                                  >
                                    <View className='cart-item__act'>
                                      <SpCheckbox
                                        key={item.item_id}
                                        checked={selection.has(item.cart_id)}
                                        onChange={this.handleSelectionChange.bind(this, item.cart_id)}
                                      />
                                      <View
                                        className='in-icon in-icon-close'
                                        onClick={this.handleDelect.bind(this, item.cart_id)}
                                      />
                                    </View>
                                  </CartItem>
                                )
                              })
                            }
                            {activity && activity.gifts && (
                              <View className='cart-group__gifts'>
                                <View className='cart-group__gifts-hd'>赠品</View>
                                <View className='cart-group__gifts-bd'>
                                  {activity.gifts.map(gift => {
                                    return (
                                      <View
                                        className='gift-item'
                                        key={gift.item_id}
                                      >
                                        <Image
                                          className='gift-item__img'
                                          src={gift.pics[0]}
                                          mode='aspectFill'
                                        />
                                        <View className='gift-item__title'>{gift.item_name}</View>
                                        <Text className='gift-item__num'>x{gift.gift_num}</Text>
                                      </View>
                                    )
                                  })}
                                </View>
                              </View>
														)}

														<View className={`toolbar cart-toolbar ${isEmpty && 'hidden'}`}>
														<View className='cart-toolbar__hd'>
															<SpCheckbox
																checked={this.isTotalChecked}
																onChange={this.handleAllSelect.bind(this,shopCart.shop_id)}
															>全选</SpCheckbox>
														</View>
															{
																cartMode !== 'edit'
																	? <View className='cart-toolbar__bd'>
																			<View className='cart-total'>
																				{list.length && list[0].discount_fee > 0 && (
																					<View className='cart-total__discount'>
																						<Text className='cart-total__hint'>优惠：</Text>
																						<Price
																							primary
																							value={-1 * list[0].discount_fee}
																							unit='cent'
																						/>
																					</View>
																				)}
																				<View className='cart-total__total'>
																					<Text className='cart-total__hint'>总计：</Text>
																					<Price
																						primary
																						value={totalPrice}
																					/>
																				</View>
																			</View>
																			<AtButton
																				type='primary'
																				className='btn-checkout'
																				disabled={totalItems <= 0}
																				onClick={this.handleCheckout}
																			>{isDrug ? '立即预约' : '结算'}</AtButton>
																		</View>
																	: <View className='cart-toolbar__bd'>
																			<AtButton
																				type='primary'
																				className='btn-checkout'
																				onClick={this.handleDelect}
																			>删除</AtButton>
																		</View>
															}
														</View>

                          </View>
                        )
                      })
                    }
                  </View>
                )
              })
            }

            {
              (!list.length || this.state.error) && (
                <View>
                  <View style='margin-bottom: 20px'>
                    <SpNote img='cart_empty.png'>快去给我挑点宝贝吧~</SpNote>
                  </View>
                  <AtButton
                    className='btn-rand'
                    type='primary'
                    onClick={this.navigateTo.bind(this, APP_HOME_PAGE, true)}
                  >随便逛逛</AtButton>
                </View>
              )
            }
          </View>

          {invalidList.length && (
            <View className='cart-list cart-list__disabled'>
              <View className='cart-list__hd'><Text>已失效</Text></View>
              <View className='cart-list__bd'>
                {invalidList.map(item => {
                  return (
                    <CartItem
                      isDisabled
                      key={item.cart_id}
                      info={item}
                    >
                      <View className='cart-item__act'>
                        <View></View>
                        <View
                          className='in-icon in-icon-close'
                          onClick={this.handleDelect.bind(this, item.cart_id)}
                        />
                      </View>
                    </CartItem>
                  )
                })}
              </View>
            </View>
          )}

          {
            !isDrug && likeList.length
              ? <View className='cart-list cart-list__disabled'>
                <View className='cart-list__hd like__hd'><Text className='cart-list__title'>猜你喜欢</Text></View>
                <View className='goods-list goods-list__type-grid'>
                  {
                    likeList.map(item => {
                      return (
                        <GoodsItem
                          key={item.item_id}
                          info={item}
                          onClick={this.handleClickItem.bind(this, item)}
                        />
                      )
                    })
                  }
                </View>
              </View>
              : null
          }
          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
          }
          {
            !page.isLoading && !page.hasNext && !likeList.length
            && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </ScrollView>

        <AtActionSheet
          title='请选择商品优惠'
          isOpened={Boolean(curPromotions)}
          onClose={this.handleClosePromotions}
        >
          {curPromotions && curPromotions.map(item => {
            return (
              <AtActionSheetItem
                key={item.marketing_id}
                onClick={this.handleSelectPromotion.bind(this, item)}
              ><Text className='cart-promotion__label'>{item.promotion_tag}</Text><Text>{item.marketing_name}</Text></AtActionSheetItem>
            )
          })}
        </AtActionSheet>

        {
          !isDrug
          && <TabBar
            current={3}
          />
        }
      </View>
    )
  }
}
