import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, SpNote, GoodsItem, NavBar,SpCheckbox } from '@/components'
import { AtCountdown } from 'taro-ui'
import { connect } from '@tarojs/redux'
import api from '@/api'
import { pickBy } from '@/utils'

import './plusprice.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

@withPager
@withBackToTop
export default class DetailPluspriceList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      query: null,
      last_seconds: 1759242,
      timer: null,
      list: [],
    }
  }

  config = {
    navigationBarTitleText: '优惠换购'
  }

  componentDidMount () {
    this.nextPage()
  }

  // onShareAppMessage () {
  //   const res = this.state.shareInfo
  //   const { userId } = Taro.getStorageSync('userinfo')
  //   const query = userId ? `?uid=${userId}` : ''    
  //   return {
  //     title: res.title,
  //     imageUrl: res.imageUrl,
  //     path: `/pages/item/seckill-goods-list${query}`
  //   }
  // }
  handleClickItem (item) {
		Taro.navigateTo({
			url: `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}`
		})
  }
  handleSelectGoods = (item,checked)=>{
    const { list } = this.state
    list.map(v => {
      v.is_checked = false
      v.item_id == item.item_id && (v.is_checked = true)
      return {
        ...v,
        is_checked:v.is_checked
      }
    })
    this.setState({
      list
    })
  }
  
   async handleClickConfirm (type){
      let { list } = this.state
      if(!list.length) return
      const selected = list.filter(v=>v.is_checked)
      if(!selected.length){
        Taro.showToast({
          title: '请选择商品～',
          icon: 'none'
        })
        return
      }
      const {marketing_id} = selected[0]
      const query = {
        item_id:type=='cancel'?0:selected[0].item_id,
        marketing_id
      }
      const {data} = await api.cart.selectedPlusitem(query)
      Taro.showToast({
        title: '操作成功~',
        icon: 'none'
      })
      type=='cancel' && (list = list.map(v=>v.is_checked=false))
      this.setState({list})
      setTimeout(() => {
         Taro.navigateBack()
       }, 300)

   }

   async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      marketing_id: this.$router.params.marketing_id,
      page,
      pageSize
    }

    const { list, total_count: total} = await api.promotion.getpluspriceList(query)
		const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
      distributor_id: 'distributor_id',
      marketing_id:'marketing_id',
      price: ({ price }) => (price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price/100).toFixed(2),
      is_checked:'is_checked'
    })

    this.setState({
      list: [...this.state.list, ...nList],
    })
    return {
      total
    }
  }


  render () {
    const { colors } = this.props
    const { list, showBackToTop, scrollTop, page } = this.state
    return (
      <View className='page-plusprice cart-page-plusprice'>
        <NavBar
          title='微商城'
        />
        <ScrollView
          className='plusprice-goods__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          {
            list && list.length > 0 && (
            <View className='plusprice-goods__list plusprice-goods__type-list'>
            {
              list.map((item) => {
                return (
                  <View key={item.item_id} className='goods-list__item'>
                    <View className='item-check'>
                      <SpCheckbox
                        checked={item.is_checked}
                        onChange={this.handleSelectGoods.bind(this,item)}
                      >
                      </SpCheckbox>
                    </View>
                    <View className='item-goodsItem'>
                    <GoodsItem
                        key={item.item_id}
                        info={item}
                        showFav={false}
                        onClick={this.handleClickItem.bind(this)}
                      >
                      </GoodsItem>
                    </View>
                    
                  </View>
                )
              })
            }
           <View className='plusprice-footer'>
             <View className='footer-list'>
             <View className='footer-item no-use' onClick={this.handleClickConfirm.bind(this,'cancel')}>不使用换购</View>
                <View className='footer-item' onClick={this.handleClickConfirm.bind(this,'confirm')}>确定</View>
             </View>
          </View>
          </View>
            )
          }
          
          { page.isLoading ? <Loading>正在加载...</Loading> : null }
          {
						!page.isLoading && !page.hasNext && !list.length
						&& (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </ScrollView>

        <BackToTop
         show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
      </View>
    )
  }
}
