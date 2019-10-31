import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,Button } from '@tarojs/components'
import { Price } from '@/components'
import { AtTabs, AtTabsPane} from 'taro-ui'
import api from '@/api'
import S from '@/spx'
import { classNames, pickBy } from '@/utils'
import './vipgrades.scss'

export default class VipIndex extends Component {
	static config = {
		navigationBarTitleText: '会员购买',
		navigationBarBackgroundColor: '#2f3030',
		navigationBarTextStyle: 'white',
		backgroundColor: '#2f3030',
		backgroundTextStyle: 'light'
  }
  constructor (props) {
    super(props)

    this.state = {
			userInfo:null,
			curTabIdx: 0,
			curCellIdx: 0,
			tabList:[],
			list:[],
			cur:null
    }
  }

	componentDidMount () {
		const userInfo = Taro.getStorageSync('userinfo')
		this.setState({
			userInfo
		}, () => {
			this.fetchInfo()
			this.fetchUserVipInfo()
		})
	}

	async fetchInfo () {
		const { cur, list } = await api.vip.getList()
		const { grade_name } = this.$router.params

		const tabList = pickBy(list, {
			title: ({grade_name}) => grade_name
		})

		const curTabIdx = tabList.findIndex(item => item.title === grade_name)

		this.setState({
			tabList,
			cur,
			list,
			curTabIdx: curTabIdx === -1 ? 0 : curTabIdx
		})
	}

	handleClickTab = (idx) => {
    this.setState({
      curTabIdx: idx
    })
	}

	checkHandle = ( index ) =>{
		this.setState({
			curCellIdx:index
		})
	}

	async handleCharge () {

		if (!S.getAuthToken()) {
      Taro.showToast({
        title: '请先登录再购买',
        icon: 'none'
      })

      setTimeout(() => {
        S.login(this)
      }, 2000)

      return
		}

		const {list,curTabIdx,curCellIdx} = this.state
		const vip_grade = list[curTabIdx]
		const params = {
			vip_grade_id: vip_grade.vip_grade_id,
			card_type: vip_grade.price_list[curCellIdx].name,
			distributor_id: Taro.getStorageSync('trackIdentity').distributor_id || ''
		}

		Taro.showLoading({ mask: true })

		const data = await api.vip.charge(params)

		Taro.hideLoading()

		var config = data
		var that = this
		wx.requestPayment({
			'timeStamp': '' + config.timeStamp,
			'nonceStr': config.nonceStr,
			'package': config.package,
			'signType': config.signType,
			'paySign': config.paySign,
			'success': function (res) {
				wx.showModal({
					content: '支付成功',
					showCancel: false,
					success: function(res) {
						console.log('success')
					}
				})
			},
			'fail': function (res) {
				wx.showModal({
					content: '支付失败',
					showCancel: false
				})
			}
		})
	}

	async fetchUserVipInfo() {
		const userVipInfo = await api.vip.getUserVipInfo()
		this.setState({
			userVipInfo
		})
	}

	render () {
		const { userInfo, list, cur, curTabIdx, userVipInfo, tabList } = this.state
		return (
			<View>
				<View className='header'>
					<View className='header-isauth'>
						<Image className='header-isauth__avatar' src={userInfo.avatar} mode='aspectFill'/>
						<View className='header-isauth__info'>
							<View className='nickname'>{userInfo.username}
								<Image  className='icon-vip' src='/assets/imgs/svip.png' />
							</View>
							<View className='mcode'>{userVipInfo.end_time} 到期，购买后有效期将延续</View>
						</View>
					</View>
					<AtTabs className='header-tab'
						current={curTabIdx}
						tabList={tabList}
						onClick={this.handleClickTab} >
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
				</View>
				<View className='section'>
					<View className='section-body'>
					 	{
							cur && cur.rate && cur.rate != 1 && (
								<View className='text-muted'>
									<text className='icon-info'></text> 货币汇率：1{cur.title} = {cur.rate}RMB
								</View>
							)
						}
						<View className='grade-list'>
						{
							list[curTabIdx]&&list[curTabIdx].price_list.map((item,index) => {
								return (
									(item.price != 0 && item.price != null)&&(
										<View className={`grade-item ${index == curCellIdx && 'active'}`} key={index} onClick={this.checkHandle.bind(this,index)}>
											<View className='item-content'>
												<View className='desc'>{item.desc}</View>
												<View className='amount'>
													<Price primary value={Number(item.price)} />
												</View>
											</View>
										</View>
									)
								)
							})
						}
						</View>
						<Button className='pay-btn' onClick={this.handleCharge}>立即支付</Button>
						<View className='content-v-padded'>会员权益</View>
						<View className='text-muted'>
							{
								list[curTabIdx] && list[curTabIdx].description.split('\n').map((item,index)=> {
									return (
										<View key={index}>{item}</View>
									)
								})
							}
						</View>
					</View>
				</View>
			</View>
		)
	}

}
