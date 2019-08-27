import Taro, { Component } from '@tarojs/taro'
import { View,Image,Text,Form} from '@tarojs/components'
import { AtButton,AtCountdown } from 'taro-ui'
import { classNames, log, isNumber } from '@/utils'
import api from '@/api'
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
			timer:null
		}
	}
	
	componentDidMount(){
		this.fetchDetail()
	}

  async fetchDetail() {
		const {group_id} = this.$router.params
		const params = {distributor_id:Taro.getStorageSync('trackIdentity')|| ''}
		const detail = await api.group.groupDetail(group_id,params)
		const {activity_info,team_info,member_list} = detail

		const {over_time:total_micro_second} = activity_info

		const userInfo = Taro.getStorageSync('userinfo')
		const user_id = userInfo && userInfo.userId || 0

		const isLeader = (user_id && (user_id == team_info.head_mid)) ? true :false

		const isSelf = (user_id && member_list.list.find(v=>v.member_id == user_id)) ? true:false

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

render () {
	const {detail,timer} = this.state

	return (
		<View>
			<View className={classNames('status-icon',{'success icon-over-group':detail && detail.team_info.team_status == 2,'fail icon-ungroup':detail && detail.team_info.team_status == 3})}></View>
      {detail.team_info.team_status == 1 && (
				<View className='activity-time  view-flex view-flex-middle'>
					<Text>距结束还剩</Text>
					<AtCountdown
						isShowDay
						day={timer.dd}
						hours={timer.hh}
						minutes={timer.mm}
						seconds={timer.ss}
					/>
        </View>
      )}
      <View className='content-padded-b'>
        <View className='group-goods'>
          <View className='view-flex'>
            <Image className='goods-img' src={detail.activity_info.pics[0]} mode='aspectFill' />
            <View className='view-flex-item view-flex view-flex-vertical view-flex-justify content-padded'>
              <View>
                <View className='goods-title'>{detail.activity_info.itemName}</View>
                {
                  detail.activity_info && (
                    <View className='price-label'><Text className='num'>{detail.activity_info.person_num}</Text><Text className='label'>人团</Text></View>
                    )
                }
              </View>
              {
                detail.activity_info && (
                  <View className='activity-amount'><Text className='cur'>￥</Text>{detail.activity_info.act_price/100}<Text className='activity-market-price text-overline'>{detail.activity_info.price/100}</Text></View>
                )
              }
            </View>
          </View>
        </View>
      </View>
      <View className='content-padded content-center'>
        {detail.team_info.team_status == 1 && ( <View>还差<Text className='group-num'>{detail.activity_info.person_num - detail.team_info.join_person_num}</Text>人拼团成功</View>)}
        {detail.team_info.team_status == 2 && (<View>团长人气爆棚，已经拼团成功啦</View>)}
        {detail.team_info.team_status == 3 && (<View>团长人气不足，拼团失败</View>)}
        
				<View className='group-member view-flex view-flex-center view-flex-wrap'>
				{detail && [...Array(detail.activity_info.person_num).keys()].map((item,index)=>{
					return (
						<View key={index} className={classNames('group-member-item',{'wait-member':detail.member_list.list[index]})}>
						{detail.member_list.list[index] && (<Image className='member-avatar'src={detail.member_list.list[index].member_info.headimgurl} mode='aspectFill' />) } 
						{detail.team_info.head_mid === detail.member_list.list[index].member_id && 	(<View className='leader-icon'>团长</View>)}
						</View>
					)
				})}
        </View> 
      </View>
      <View className='content-padded-b'>
        {
          detail.team_info.team_status == 1 ? 
          <View>
            {
              (!isLeader && !isSelf) && (
                <View>
                  <Form report-submit bindsubmit='formSubmit'>
                    <AtButton className='btn-submit' form-type='submit'>我要参团</AtButton>
                  </Form>
                </View>
              )
            }
            {isLeader && (<AtButton className='btn-submit' open-type='share'>邀请好友参团</AtButton>)}
            {(!isLeader && isSelf) && (<AtButton className='btn-submit' onClick='toOpen'>我也要开团</AtButton>)}
          </View>
          : 
          <View>
            <View className='content-bottom-padded-b'>
              {!isLeader ? (<AtButton className='btn-submit' onClick='toOpen'>我也要开团</AtButton>) : (<AtButton className='btn-submit' onClick='toOpen'>重新开团</AtButton>)}
            </View>
            <AtButton className='btn-default' onClick='toHome'>更多活动爆品</AtButton>
          </View>
        }
      </View>
      {!isLeader ? (<View className='text-muted content-center'>将小程序分享到群里，将大大提高成团成功率</View>) : (<View className='text-muted content-center'>拼团玩法：好友参团，成团发货，不成团退款</View>)}   
    
		</View>
		)
	}
}