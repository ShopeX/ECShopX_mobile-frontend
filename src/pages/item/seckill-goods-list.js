import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, SpNote, GoodsItem } from '@/components'
import {AtCountdown, AtTabs, AtTabsPane} from 'taro-ui'
import api from '@/api'
import { pickBy } from '@/utils'

import './seckill-goods-list.scss'

@withPager
@withBackToTop
export default class SeckillGoodsList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      query: null,
      last_seconds: 1759242,
      timer: null,
      list: [],
      imgurl: '',
      status: ''
    }
  }

  config = {
    navigationBarTitleText: '限时秒杀'
  }

  componentDidMount () {
    // this.setState({
    //   query: {
    //     status: this.state.curTabIdx === 0 ? 'valid' : 'notice',
    //     item_type: 'normal'
    //   }
    // }, () => {
    //   this.nextPage()
		// })
		this.nextPage()
  }

  calcTimer (totalSec) {
    let remainingSec = totalSec
    const dd = Math.floor(totalSec / 24 / 3600)
    remainingSec -= dd * 3600 * 24
    const hh = Math.floor(remainingSec / 3600)
    remainingSec -= hh * 3600
    const mm = Math.floor(remainingSec / 60)
    remainingSec -= mm * 60
    const ss = Math.floor(remainingSec)

    return {
			dd,
			hh,
      mm,
      ss
    }
  }
  handleClickItem (id) {
		Taro.navigateTo({
			url: `/pages/item/espier-detail?id=${id}`
		})
	}
  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      seckill_id: this.$router.params.seckill_id,
      page,
      pageSize
    }

		const { items: list, total_count: total, ad_pic: imgurl, last_seconds, status} = await api.seckill.seckillGoodsList(query)

    let timer = null
    timer = this.calcTimer(last_seconds)

		const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
      price: ({ activity_price }) => (activity_price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price/100).toFixed(2)
    })

    this.setState({
			timer,
      list: [...this.state.list, ...nList],
			imgurl,
      status,
			last_seconds
    })
    return {
      total
    }
  }


  render () {
    const { list, imgurl, showBackToTop, scrollTop, page, timer, status } = this.state
    return (
      <View className='page-seckill-goods'>
        <ScrollView
          className='seckill-goods__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <Image className='seckill-goods__swiper' src={imgurl} mode='widthFix' />
          {
            status === 'it_has_ended'
              ? <View className='seckill-goods__timer'><Text>活动已结束</Text></View>
    					: <View className='seckill-goods__timer'>
      						<View>
      							<AtCountdown
      							  isShowDay
      								day={timer.dd}
        							hours={timer.hh}
      								minutes={timer.mm}
      								seconds={timer.ss}
      							/>
                    {status === 'in_the_notice' && <Text>后开始</Text>}
      							{status === 'in_sale' && <Text>后结束</Text>}
      						</View>
                </View>
          }
          <View className='seckill-goods__list'>
            {
              list.map((item, index) => {
                return (
                  <GoodsItem
                    key={item.item_id}
										info={item}
										showFav={false}
                    onClick={() => this.handleClickItem(item.item_id)}
									>
									<View className='seckill-goods__list-btn'>
                    {status === 'in_the_notice' && <Text>去看看</Text>}
                    {status === 'in_sale' && <Text>马上抢</Text>}
                    {status === 'it_has_ended' && <Text>原价买</Text>}
                  </View>
									</GoodsItem>
                )
              })
            }
          </View>
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
