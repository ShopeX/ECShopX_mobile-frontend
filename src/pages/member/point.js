
import Taro, { Component } from '@tarojs/taro'
import {View, Text, ScrollView} from '@tarojs/components'
import {AtButton, AtDivider} from 'taro-ui'
import { Loading, SpNote, NavBar } from '@/components'
import { withPager } from '@/hocs'
import { pickBy, formatDataTime } from '@/utils'
import api from '@/api'

import './point.scss'

@withPager
export default class Integral extends Component {
  static defaultProps = {
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      isLoading: false,
      totalPoint: 0
    }
  }

  componentDidMount () {
    this.nextPage()

  }


  async fetch (params) {
    const { page_no: page, page_size: size } = params

    this.setState({ isLoading: true })
    params = {
      page,
      size
    }
    const { list , total_count: total, remainpt } = await api.member.pointList(params)
    const nList = pickBy(list, {
      chngdate: ({ chngdate }) => chngdate.substring(0, 4)+ '-' + chngdate.substring(4, 6)+ '-' + chngdate.substring(6, 8),
      point: 'point',
      point_desc: 'point_desc',
      created: ({ created }) => (formatDataTime(created * 1000)),
    })
    console.log(nList, 58)

    this.setState({
      list: [...this.state.list, ...nList],
      totalPoint: remainpt
    })

    return {
      total
    }
  }

  handleClickRoam = () => {

  }

  render () {
    const { list, page, totalPoint } = this.state

    return (
      <View className='page-member-integral'>
        <NavBar
          title='积分'
          leftIconType='chevron-left'
        />
        <View className='member-point__hd'>
          <View className='member-point__hd_content'>
            <Text className='member-point__num'>{totalPoint}</Text>
            <Text>积分</Text>
          </View>
        </View>
        <View className='member-point__content'>
          <ScrollView
            scrollY
            className='member-point__scroll'
            onScrollToLower={this.nextPage}
          >
            <AtDivider fontColor='#787878' lineColor='#EFEFEF' content='积分详情' />
            {
              list.map((item, idx) => {
                return (
                  <View key={idx}>
                    <View className='point-item'>
                      <View className='point-item__title'>
                        <Text className='point-item__title-name'>{item.point_desc}</Text>
                        <Text className={`point-item__title-${item.outin_type}`}>{item.outin_type === 'in' ? '+' : '-'}{item.point}</Text>
                      </View>
                      <View className='point-item__data'>{item.chngdate}</View>
                    </View>
                  </View>
                )
              })
            }
            {
              page.isLoading && <Loading>正在加载...</Loading>
            }
            {
              !page.isLoading && !page.hasNext && !list.length
              && (
                <View>
                  <SpNote className='integral_empty' img='integral_empty.png'>赶快赚积分吧~</SpNote>
                  <View className='btns'>
                    <AtButton type='primary' onClick={this.handleClickRoam}>随便逛逛</AtButton>
                  </View>
                </View>
              )
            }
          </ScrollView>
        </View>
        {/*<View className='member-integral__hd'>
          <View className='integral-info'>
            <View className='integral-number'>
              <Text className='sp-icon sp-icon-jifen1 icon-point'> </Text>
              <Text className='integral-number__text'>{totalPoint}</Text>
            </View>
            <View className='integral-text'>当前可用积分</View>
          </View>
        </View>*/}

       {/* <View className='member-integral__bd'>

          <View className='integral-sec member-integral'>
            <AtTabs
              className='member-integral__tabs'
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
                    className='member-integral__panel'
                  >

                  </AtTabsPane>)
                )
              }
            </AtTabs>

            <ScrollView
              scrollY
              className='member-integral__scroll'
              onScrollToLower={this.nextPage}
            >
              {
                list.map((item, idx) => {
                  return (
                    <View key={idx}>
                      <View className='integral-item'>
                        <View className='integral-item__title'>
                          <Text className='integral-item__title-name'>{item.point_desc}</Text>
                          <Text className={`integral-item__title-${item.outin_type}`}>{item.outin_type === 'in' ? '+' : '-'}{item.point}</Text>
                        </View>
                        <View className='integral-item__data'>{item.created}</View>
                      </View>
                    </View>
                  )
                })
              }
              {
                page.isLoading && <Loading>正在加载...</Loading>
              }
              {
                !page.isLoading && !page.hasNext && !list.length
                && (
                  <View>
                    <SpNote className='integral_empty' img='integral_empty.png'>赶快赚积分吧~</SpNote>
                    <View className='btns'>
                      <AtButton type='primary' onClick={this.handleClickRoam}>随便逛逛</AtButton>
                    </View>
                  </View>
                )
              }
            </ScrollView>
          </View>
        </View>*/}
      </View>
    )
  }
}
