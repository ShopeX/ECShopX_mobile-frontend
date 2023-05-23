import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text, Block } from '@tarojs/components'
import { SpImg } from '@/components'
import S from '@/spx'
import api from '@/api'
import { connect } from 'react-redux'

import './comp-scrollitem.scss'

@connect(({ member }) => ({
  memberData: member.member
}))
export default class Scrollitem extends Component {
  static defaultProps = {
    item: {
      image_url: '',
      badges: []
    },
    type: ''
  }
  constructor(props) {
    super(props)

    this.state = {
      iscollection: 0,
      likes: 0
    }
  }
  componentDidMount() {
    let { item } = this.props
    this.setspot(item)
    console.log(123456,item,this.props.memberData)
  }
  componentWillReceiveProps(nextProps) {
    this.setspot(nextProps.item)
  }
  setspot = (item) => {
    // console.log("触发",item.isheart,item.likes)
    this.setState({
      iscollection: item.isheart,
      likes: item.likes
    })
  }
  handleClickItem(item) {
    Taro.navigateTo({
      url: `/subpages/mdugc/pages/make_details/index2?item_id=${item.item_id}`
    })
  }
  // 收藏
  oncollection = async () => {
    let { item, memberData } = this.props

    const isAuth = S.getAuthToken()
    if (!isAuth || !memberData.memberInfo) {
      Taro.showToast({
        icon: 'none',
        title: '请先登录'
      })
      // setTimeout(() => {
      //   Taro.redirectTo({
      //     url:"/pages/member/index"
      //   })
      // }, 1000)

      return
    }
    let { iscollection, likes } = this.state
    let data = {
      user_id: memberData.memberInfo.user_id,
      post_id: item.item_id
    }
    let res = await api.mdugc.postlike(data)
    let message = ''
    if (res.action) {
      if (res.action == 'unlike') {
        iscollection = 0
        message = '取消点赞'
      } else if ((res.action = 'like')) {
        iscollection = 1
        message = '点赞成功'
      }
      Taro.showToast({
        icon: 'none',
        title: message,
        duration: 1000
      })
      likes = res.likes
      this.setState({
        likes,
        iscollection
      })
      this.props.setlikes(item.item_id, iscollection, likes)
    }
  }

  render() {
    const { item, type } = this.props
    let { iscollection, likes } = this.state
    if (item && Object.keys(item) == 0) {
      return <Block></Block>
    }
    return (
      <View className='scrollitemlisti' key={item.item_id}>
        <View className='img' onClick={() => this.handleClickItem(item)}>
          {/* <Image className="img_i" mode='widthFix' src={item.image_url} ></Image> */}
          <SpImg img-class='img_i' src={item.image_url} mode='widthFix' lazyLoad />
        </View>
        <View className='text'>
          <View className='title'>
            <Text>{item.title}</Text>
          </View>
          <View className='btm'>
            <View className='btm_left'>
              <SpImg img-class='btm_left_img' src={item.head_portrait} mode='widthFix' lazyLoad />
              <View className='btm_left_text'>{item.author}</View>
            </View>
            {iscollection ? (
              <View
                onClick={this.oncollection.bind(this, item)}
                className='btm_right iconfont icon-dianzanFilled'
              >
                <Text>{likes}</Text>
              </View>
            ) : (
              <View
                onClick={this.oncollection.bind(this, item)}
                className='btm_right iconfont icon-dianzan'
              >
                <Text>{likes}</Text>
              </View>
            )}
          </View>
        </View>
        {type == 'member' && item.status != '1' ? (
          <View className='mask' onClick={() => this.handleClickItem(item)}>
            <View className='mask_i'>
              <View
                className={`mask_i_icon iconfont ${
                  item.status == 2 || item.status == 4 ? 'icon-shenhebuguo' : 'icon-shenhe'
                }`}
              ></View>
              <View className='mask_i_text'>
                {item.status == 2 || item.status == 4 ? '审核不通过' : '审核中'}
              </View>
            </View>
          </View>
        ) : null}
        <View className='badges'>
          {item.badges.map((tagi, i) => {
            return <View className='badges_i'>{tagi.badge_name}</View>
          })}
        </View>
      </View>
    )
  }
}
