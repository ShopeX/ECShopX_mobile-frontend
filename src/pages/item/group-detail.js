import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Navigator} from '@tarojs/components'
// import { handleShareOptions } from '../util/share'
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
			distributorId: '',
			goodsId: '',
			isSelf: false,
			detail: {},
			formId: '',
			hasAuth: false,
			mobile: '',
			loginCode: '',
			actId: '',
			teamId: '',
			isLeader: false,
			purchasetype: 1,
			total_micro_second: '',
			showLoading: true,
			formPay: false
		}
	}
	
	componentDidMount(){
		this.fetchDetail()
	}

	toOpen() {
		// taro.redirectTo({
		// 	url: `/pages/goodsdetail?id=${this.goodsId}`
		// })
	}

	// formSubmit (e) {
	// 	let formId = e.detail.formId
	// 	http.action(api.promotion.formid, {formid: formId})
	// 	this.$parent.globalData.productList = [{
	// 		item_id: this.detail.activity_info.itemId,
	// 		item_name: this.detail.activity_info.itemName,
	// 		pics: this.detail.activity_info.pics,
	// 		price: this.detail.activity_info.act_price,
	// 		num: 1
	// 	}]
	// 	taro.navigateTo({
	// 		url: `pay?type=group&teamId=${this.teamId}&groupId=${this.detail.activity_info.groups_activity_id}`
	// 	})
	// }

  async fetchDetail() {
		const {group_id} = this.$router.params
		const params = {distributor_id:Taro.getStorageSync('trackIdentity')|| ''}
		const detail = api.group.groupDetail(group_id,params)

    // this.detail = res
    // this.goodsId = res.activity_info.itemId
    // this.actId = res.activity_info.act_id
    // this.shopId = res.activity_info.shop_id
		// this.total_micro_second = res.activity_info.over_time
		
    // let userData = await users.getSession()
    // if (userData && this.mobile) {
    //   if (userData.memberInfo.user_id == res.team_info.head_mid) {
    //     this.isLeader = true
    //   } else {
    //     this.isLeader = false
    //   }
    //   res.member_list.list.forEach(item => {
    //     if (userData.memberInfo.user_id == item.member_id) {
    //       this.isSelf = true
    //     }
    //   })
    // }
    // if (res.team_info.team_status == 1) {
    //   this.countDown()
    // }
    // this.showLoading = false
    
  }

  // onShareAppMessage (res) {
  //   const selfId = wepy.getStorageSync('trackIdentity').distributor_id
  //   const userInfo = users.getSession()
  //   const uid = userInfo.memberInfo.user_id || ''
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //   }
  //   return {
  //     title: `【拼团】${this.detail.activity_info.share_desc}`,
  //     path: `/pages/group_detail?teamId=${this.teamId}&dtid=${selfId}&uid=${uid}`,
  //     imageUrl: this.detail.activity_info.pics[0],
  //     success: function(res) {
  //       // 转发成功
  //     },
  //     fail: function(res) {
  //       // 转发失败
  //     }
  //   }
  // }

  // async onLoad(options) {

  //   console.log('传入参数', options)

  //   var option = await handleShareOptions(options, true)

  //   let trackIdentity = wepy.getStorageSync('trackIdentity')
  //   if (trackIdentity) {
  //       this.distributorId = trackIdentity.distributor_id
  //   }
  //   console.log('接受后的dtid', this.distributorId)

  //   this.timeout = null;
  //   this.total_micro_second = ''
  //   this.detail = {};
  //   this.teamId = options.teamId
  //   this.fetchDetail()
    
  // }


render () {
	const {detail} = this.state

	return (
		<View>
			
		</View>
		)
	}
}