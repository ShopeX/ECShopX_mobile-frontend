import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import { NavBar } from '@/components'

import './vipgrades.scss'

export default class VipIndex extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userInfo:null
    }
  }

  componentDidShow = () => {}

	componentDidMount () {
		const userInfo = Taro.getStorageSync('userinfo')
		this.setState({
			userInfo
		})
		
	}
	
	render () {
		const { userInfo } = this.state
		return (
			<View>
				<NavBar
						title='会员购买'
						leftIconType='chevron-left'
						fixed='true'
        />
				<View className='header'>
					<View className='header-isauth'>
						<Image className='header-isauth__avatar' src={userInfo.avatar} mode='aspectFill'/>
						<View className='header-isauth__info'>
							<View className='nickname'>{userInfo.nickName} 
								<Image  className='icon-vip' src='/assets/imgs/svip.png' />
							</View>
							<View className='mcode'>{uservip.endDate} 到期，购买后有效期将延续</View>
						</View>
					</View>
				</View>
			</View>
		)
	}

}