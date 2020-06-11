import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, SpNote } from '@/components'
import {AtCountdown, AtTabs, AtTabsPane} from 'taro-ui'
import api from '@/api'

import './seckill-list.scss'

@withPager
@withBackToTop
export default class SeckillList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '进行中', status: 'valid'},
        {title: '未开始', status: 'notice'}
      ],
      query: null,
      list: [],
      timeCountDown: []
    }
  }

  config = {
    navigationBarTitleText: ''
  }

  componentDidMount () {
    this.setState({
      query: {
        status: this.state.curTabIdx === 0 ? 'valid' : 'notice',
        item_type: 'normal'
      }
    }, () => {
      this.nextPage()
		})
  }

  calcTimer (t_index, totalSec) {
    let remainingSec = totalSec
    const { timeCountDown } = this.state
    const dd = Math.floor(totalSec / 24 / 3600)
    remainingSec -= dd * 3600 * 24
    const hh = Math.floor(remainingSec / 3600)
    remainingSec -= hh * 3600
    const mm = Math.floor(remainingSec / 60)
    remainingSec -= mm * 60
    const ss = Math.floor(remainingSec)
    timeCountDown.map((item, index) => {
      if(index === t_index){
        item.dd = dd,
        item.hh = hh,
        item.mm = mm,
        item.ss = ss
      }
    })
    this.setState({
      timeCountDown
    })
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      status: this.state.curTabIdx === 0 ? 'valid' : 'notice',
      page,
      pageSize
    }

    const { list, total_count: total } = await api.seckill.seckillList(query)

		let timeCountDown = []
    list.map(item => {
      timeCountDown.push({
        timer: null,
        micro_second: item.last_seconds,
        time: ''
      })
    })

    this.setState({
      timeCountDown,
    },()=>{
      timeCountDown.map((t_item,t_index) => {
        if (t_item.micro_second === 0) {
          t_item.time = 0
          return
        }
        this.calcTimer(t_index, t_item.micro_second)
      })
    })

    this.setState({
      list: [...this.state.list, ...list],
      query
    })

    return {
      total
    }
  }

  handleClickTab = (idx) => {
    if (this.state.page.isLoading) return

    if (idx !== this.state.curTabIdx) {
      this.resetPage()
      this.setState({
        list: []
      })
    }

    this.setState({
      curTabIdx: idx
    }, () => {
      this.nextPage()
    })
  }

  handleClickItem = (seckill_id) => {
    Taro.navigateTo({
      url: `/pages/item/seckill-goods-list?seckill_id=${seckill_id}`
    })
  }

  render () {
    const { list, curTabIdx, tabList, showBackToTop, scrollTop, page, timeCountDown } = this.state
    return (
      <View className='page-seckill-list'>
        <AtTabs
          className='seckill__tabs'
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
        >
           {
             tabList.map((panes, pIdx) =>
               (<AtTabsPane
                 current={curTabIdx}
                 key={pIdx}
                 index={pIdx}
               >
               </AtTabsPane>)
             )
           }
        </AtTabs>
        <ScrollView
          className='seckill__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View>
            {
              list.map((item, index) => {
                return (
                  <View className='seckill-list' key={index} onClick={this.handleClickItem.bind(this, item.seckill_id)}>
                    <View className='seckill-list__title'>离结束还有：
                      <AtCountdown
                        isShowDay
                        day={timeCountDown[index].dd}
                        hours={timeCountDown[index].hh}
                        minutes={timeCountDown[index].mm}
                        seconds={timeCountDown[index].ss}
                      />
										</View>
                    <Image className='seckill-list__banner' mode='widthFix' src={item.ad_pic} />
										<View className='seckill-goods'>
										{
											item.items.map(seckill=>{
												return (
													<View className='seckill-goods__item'>
														<Image className='seckill-goods__img' mode='aspectFill' src={seckill.pics[0]} />
														<Text className='seckill-goods__title'>{seckill.item_title}</Text>
													</View>
												)
											})

										}
                    </View>
                  </View>
                )
              })
            }
          </View>
          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
          }
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
