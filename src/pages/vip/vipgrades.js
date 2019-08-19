import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,Price } from '@tarojs/components'
import { AtTabs, AtTabsPane} from 'taro-ui'
import api from '@/api'

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
			tabList:[],
			list:[],
			cur:null
    }
  }

  componentDidShow = () => {}

	componentDidMount () {
		const userInfo = Taro.getStorageSync('userinfo')
		this.setState({
			userInfo
		})
		this.fetchInfo()
	}

	async fetchInfo (){
		const {cur,list} = await api.vip.getList()

		const tabList = list.map(tab=>{
			 return {title:tab.grade_name}
		})
		this.setState({
			tabList,
			cur,
			list
		})
	}

	handleClickTab = (idx) => {
    this.setState({
      curTabIdx: idx
    })
	}
	
	checkHandle = (key, e) =>{
		// this.currentCell = key
		// this.isClick = true
		// this.params.card_type = e.currentTarget.dataset.name
		// this.checkedPrice = e.currentTarget.dataset.price
	}
	
	render () {
		const { userInfo,list,cur,curTabIdx} = this.state
		return (
			<View>
				<View className='header'>
					<View className='header-isauth'>
						<Image className='header-isauth__avatar' src={userInfo.avatar} mode='aspectFill'/>
						<View className='header-isauth__info'>
							<View className='nickname'>{userInfo.username} 
								<Image  className='icon-vip' src='/assets/imgs/svip.png' />
							</View>
							<View className='mcode'>{uservip.endDate} 到期，购买后有效期将延续</View>
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
						
						{list[curTabIdx].price_list.map((item,index) => {
							return (
								<View className={`grade-item ${index == curTabIdx && 'active'}`}  onClick={this.checkHandle}>
									<View className='item-content'>
										<View className='desc'>{item.desc}</View>
										<View className='amount'>
											<Price primary value={item.price} unit='cent' />
										</View>
									</View>
								</View>
							)
						})}
						</View>
					</View>
				</View>
			</View>
		)
	}

}