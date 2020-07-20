import Taro, { Component } from '@tarojs/taro'
import { View,Image,Text } from '@tarojs/components'
import { AtButton, AtCountdown } from 'taro-ui'
import { FormIdCollector } from '@/components'
import { classNames } from '@/utils'
import api from '@/api'
import S from '@/spx'
import './group-detail.scss'

export default class GroupDetail extends Component {
  static config = {
    navigationBarTitleText: '拼团详情'
  }

	constructor (props) {
		super(props)
		this.state = {
			isSelf: false,
			detail: null,
			isLeader: false,
			timer: null
		}
	}

	componentDidMount() {
		this.fetchDetail()
	}

  async fetchDetail() {
		const { team_id } = this.$router.params
    const { distributor_id } = Taro.getStorageSync('curStore')
		const params = { distributor_id }
		const detail = await api.group.groupDetail(team_id, params)
		const { activity_info, team_info, member_list } = detail

		const { over_time: total_micro_second } = activity_info

		const userInfo = Taro.getStorageSync('userinfo')
		const user_id = userInfo && userInfo.userId || 0

		const isLeader = (user_id && (user_id == team_info.head_mid)) ? true : false

		const isSelf = (user_id && member_list.list.find(v=>v.member_id == user_id)) ? true : false

		let timer = null
		timer = this.calcTimer(total_micro_second)

		this.setState({
			timer,
			detail,
			isLeader,
			isSelf
		})
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

  handleJoinClick = async () => {
    if (!S.getAuthToken()) {
      S.toast('请先登录')

      setTimeout(() => {
        S.login(this)
      }, 2000)

      return
    }

    const { detail } = this.state
    const { activity_info, team_info } = detail

    try {
      await api.cart.fastBuy({
        item_id: activity_info.goods_id,
        num: 1
      })
    } catch (e) {
      console.log(e)
    }

    Taro.navigateTo({
      url: `/pages/cart/espier-checkout?type=group&team_id=${team_info.team_id}&group_id=${activity_info.groups_activity_id}`
    })
  }

  handleDetailClick = () => {
    const { detail } = this.state
    const { activity_info, team_info } = detail

    Taro.redirectTo({
      url: `/pages/item/espier-detail?id=${activity_info.goods_id}`
    })
  }

  handleBackActivity = () => {
    Taro.redirectTo({
      url: '/pages/item/group-list'
    })
  }

  onShareAppMessage () {
    const { distributor_id } = Taro.getStorageSync('curStore')
    const { userId } = Taro.getStorageSync('userinfo')
    const { detail } = this.state
    const { team_info, activity_info } = detail
    return {
      title: `【拼团】${activity_info.share_desc}`,
      path: `/pages/item/group-detail?team_id=${team_info.team_id}&dtid=${distributor_id}&uid=${userId}`,
      imageUrl: activity_info.pics[0]
    }
  }

  onShareTimeline () {
    const { distributor_id } = Taro.getStorageSync('curStore')
    const { userId } = Taro.getStorageSync('userinfo')
    const { detail } = this.state
    const { team_info, activity_info } = detail
    return {
      title: `【拼团】${activity_info.share_desc}`,
      query: `team_id=${team_info.team_id}&dtid=${distributor_id}&uid=${userId}`,
      imageUrl: activity_info.pics[0]
    }
  }

  render () {
  	const { detail, timer, isLeader, isSelf } = this.state
    if (!detail) return null
    const { team_info, activity_info, member_list } = detail

  	return (
  		<View className='page-group-detail'>
  			<View className={classNames('status-icon', {'success icon-over-group': detail && team_info.team_status == 2,'fail icon-ungroup': detail && team_info.team_status == 3})}></View>
        {
          team_info.team_status == 1 &&
    				<View className='activity-time'>
    					<View className='activity-time__label'>距结束还剩</View>
    					<AtCountdown
                className="countdown__time"
    						isShowDay
    						day={timer.dd}
    						hours={timer.hh}
    						minutes={timer.mm}
    						seconds={timer.ss}
    					/>
            </View>
        }
        <View className='content-padded-b'>
          <View className='group-goods'>
            <View className='view-flex'>
              <Image
                className='goods-img'
                src={activity_info.pics[0]} mode='aspectFill'
                />
              <View className='view-flex-item view-flex view-flex-vertical view-flex-justify content-padded'>
                <View>
                  <View className='goods-title'>{activity_info.itemName}</View>
                  {
                    activity_info &&
                      <View className='price-label'><Text className='num'>
                        {activity_info.person_num}</Text><Text className='label'>人团</Text>
                      </View>
                  }
                </View>
                {
                  activity_info &&
                    <View className='activity-amount'>
                      <Text className='cur'>￥</Text>{activity_info.act_price/100}
                      <Text className='activity-market-price text-overline'>{activity_info.price/100}</Text>
                    </View>
                }
              </View>
            </View>
          </View>
        </View>
        <View className='content-padded content-center'>
          {
            team_info.team_status == 1 &&
              <View>
                还差
                <Text className='group-num'>
                  {activity_info.person_num - team_info.join_person_num}
                </Text>
                人拼团成功
              </View>
          }
          { team_info.team_status == 2 && <View>团长人气爆棚，已经拼团成功啦</View> }
          { team_info.team_status == 3 && <View>团长人气不足，拼团失败</View> }

  				<View className='group-member view-flex view-flex-center view-flex-wrap'>
    				{detail && [...Array(activity_info.person_num).keys()].map((item, index) => {
    					return (
    						<View
                  key={index}
                  className={classNames('group-member-item',{'wait-member':member_list.list[index]})}
                  >
      						{
                    member_list.list[index] &&
                      <Image
                        className='member-avatar'
                        src={member_list.list[index].member_info.headimgurl}
                        mode='aspectFill'
                        />
                  }
    						  {
                    team_info.head_mid === member_list.list[index].member_id &&
                      <View className='leader-icon'>团长</View>
                  }
    						</View>
    					)
    				})}
          </View>
        </View>
        <View className='content-padded-b'>
          {
            team_info.team_status == 1 ?
            <View>
              {
                (!isLeader && !isSelf) &&
                  <FormIdCollector
                    sync
                    onClick={this.handleJoinClick.bind(this)}
                  >
                    <View className='btn-submit'>我要参团</View>
                  </FormIdCollector>
              }
              {
                isLeader &&
                  <AtButton type='primary' className='btn-submit' openType='share'>邀请好友参团</AtButton>
              }
              {
                (!isLeader && isSelf)
                  && <AtButton
                      type='primary'
                      className='btn-submit'
                      onClick={this.handleDetailClick.bind(this)}
                      >我也要开团</AtButton>
              }
            </View>
            :
            <View>
              <View className='content-bottom-padded-b'>
                <AtButton
                  type='primary'
                  className='btn-submit'
                  onClick={this.handleDetailClick.bind(this)}
                  >{!isLeader ? '我也要开团' : '重新开团'}</AtButton>
              </View>
              <AtButton
                className='btn-default'
                onClick={this.handleBackActivity}
                >更多活动爆品</AtButton>
            </View>
          }
        </View>
        <View className='text-muted content-center'>
          {!isLeader ? '将小程序分享到群里，将大大提高成团成功率' : '拼团玩法：好友参团，成团发货，不成团退款'}
        </View>
  		</View>
  	)
  }
}
