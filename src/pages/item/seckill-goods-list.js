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
      list: [
        {
          last_seconds: 1759242,
          img: 'http://mmbiz.qpic.cn/mmbiz_jpg/1nDJByqmW2f7v2eYIjM9lKBnyGsyZyCUDmZEE648cE7VZlvlNkFJMQcic6VtG6YnElMYJzWV2nJDtFU09xibhxgg/0?wx_fmt=jpeg'
        },
        {
          last_seconds: 1775245,
          img: 'http://mmbiz.qpic.cn/mmbiz_jpg/1nDJByqmW2f7v2eYIjM9lKBnyGsyZyCUDmZEE648cE7VZlvlNkFJMQcic6VtG6YnElMYJzWV2nJDtFU09xibhxgg/0?wx_fmt=jpeg'
        },
      ],
      imgurl: 'http://mmbiz.qpic.cn/mmbiz_jpg/1nDJByqmW2f7v2eYIjM9lKBnyGsyZyCUDmZEE648cE7VZlvlNkFJMQcic6VtG6YnElMYJzWV2nJDtFU09xibhxgg/0?wx_fmt=jpeg'
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
    this.fetch()
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

  async fetch (params) {
    // const { page_no: page, page_size: pageSize } = params
    // const query = {
    //   status: this.state.curTabIdx === 0 ? 'valid' : 'notice',
    //   page,
    //   pageSize
    // }

    // const { list, total_count: total } = await api.seckill.seckillList(query)
    const { list, last_seconds } = this.state
    let timer = null
    timer = this.calcTimer(last_seconds)
    this.setState({
      timer
    })
    // console.log(this.state.list, 53)

    // const nList = pickBy(list, {
    //   img: 'pics[0]',
    //   item_id: 'item_id',
    //   title: 'itemName',
    //   desc: 'brief',
    //   price: 'point',
    // })
    //
    // this.setState({
    //   list: [...this.state.list, ...nList],
    //   query
    // })

    // return {
    //   total
    // }
  }


  render () {
    const { list, imgurl, showBackToTop, scrollTop, page, timer } = this.state
    return (
      <View className='page-seckill-goods'>
        <ScrollView
          className='seckill-goods__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          // onScrollToLower={this.nextPage}
        >
          <Image className='seckill-goods__swiper' src={imgurl} mode='widthFix' />
          <View className=''>
            <AtCountdown
              isShowDay
              day={timer.dd}
              hours={timer.hh}
              minutes={timer.mm}
              seconds={timer.ss}
            />
            后结束
          </View>
          <View className='seckill-goods__list'>
            {
              list.map((item, index) => {
                return (
                  <GoodsItem
                    key={item.item_id}
                    info={item}
                    onClick={() => this.handleClickItem(item)}
                  />
                )
              })
            }
          </View>
          {/*{*/}
          {/*page.isLoading*/}
          {/*? <Loading>正在加载...</Loading>*/}
          {/*: null*/}
          {/*}*/}
          {/*{*/}
          {/*!page.isLoading && !page.hasNext && !list.length*/}
          {/*&& (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)*/}
          {/*}*/}
        </ScrollView>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
      </View>
    )
  }
}
