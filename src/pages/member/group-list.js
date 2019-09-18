import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtButton, AtCountdown } from 'taro-ui'
import { Loading, SpNote, Price } from '@/components'
import _mapKeys from 'lodash/mapKeys'
import api from '@/api'
import { withPager } from '@/hocs'
import { calcTimer } from '@/utils'
import './group-list.scss'

@withPager
export default class myGroupList extends Component {
  static config = {
    navigationBarTitleText: '我的拼团'
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: []
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    params = _mapKeys({
      ...params,
      group_goods_type: 'normal',
      team_status: '0'
    }, function (val, key) {
      if (key === 'page_no') return 'page'
      if (key === 'page_size') return 'pageSize'

      return key
    })

    const { list, total_count: total } = await api.group.myGroupList(params)
    list.forEach(t => {
      if (t.remaining_time > 0) {
        t.remaining_time_obj = calcTimer(t.remaining_time)
      }
    })

    this.setState({
      list: [...this.state.list, ...list]
    })

    return { total }
  }


  handleClickItem = (item) => {
    const { team_id } = item

    Taro.navigateTo({
      url: `/pages/item/group-detail?team_id=${team_id}`
		})

  }

  render () {
    const { tabList, curTabIdx, list, page } = this.state

    return (
      <View className='page-my-group-list'>
				{
					list.map((item, idx) => {
						const { remaining_time_obj } = item
						return (
							<View
								className='group-item'
								key={item.groups_activity_id}
								onClick={this.handleClickItem.bind(this, item)}
							>
								<View className='group-item__hd'>
									<Image className='group-item__img'
										mode='aspectFill'
										src={item.pics[0]}
									/>
								</View>
								<View className='group-item__bd'>
									<View className='group-item__cont'>
										{item.team_status == 2 && <View className='icon icon-over-group'></View>}
										{item.team_status == 3 && <View className='icon icon-ungroup'></View>}
										<Text className='group-item__title'>{item.itemName}</Text>
										<View className='group-item__desc'>
											<View className='group-item__tuan'><Text className='group-item__tuan-num'>{item.person_num}</Text><Text className='group-item__tuan-txt'>人团</Text></View>
											<Price
												primary
												className='group-item__price'
												value={item.price}
												unit='cent'
											/>
										</View>
									</View>
                  <View className='group-item__footer'>
  									<View className='group-item__avatar'>
  										{item.member_list.map((avatar, index) => {
  											return(
  												<Image key={index}  mode='aspectFill' className='user-avatar' src={avatar.member_info.headimgurl}/>
  												)
  										})}
  									</View>
                    {item.team_status == 1 && (
											<View className='group-item__tips'>还差<Text className='mark'>{item.person_num - item.join_person_num}</Text>人成团</View>
										)}
                  </View>
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
						&& (<SpNote img='trades_empty.png'>暂无拼团~</SpNote>)
				}
      </View>
    )
  }
}
