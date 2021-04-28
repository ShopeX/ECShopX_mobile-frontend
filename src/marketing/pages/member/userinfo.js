import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import {AtButton, AtForm, AtInput, AtAvatar} from 'taro-ui'
import { NavBar, SpCheckbox } from '@/components'
import api from '@/api'
// import { withLogin } from '@/hocs'
import S from '@/spx'
import azureUploader from '@/utils/azure-wry'
import { isArray, isString } from '@/utils'
import { connect } from "@tarojs/redux"

import './userinfo.scss'

@connect(( { colors } ) => ({
  colors: colors.current
}), () => ({}))
// @withLogin()

export default class UserInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isHasAvator: true,
      imgs: [],
      info: {},
      list: [],
      isHasData: true,
      option_list: [],
      showCheckboxPanel: false,
    }
  }

  componentDidMount () {
    // this.fetch()
  }

  config = {
    navigationBarTitleText: '个人信息'
  }

  async fetch () {
    let arr  = []
    const { memberInfo } = await api.member.memberInfo()
    let res = await api.user.regParam()
    const info = {
      user_name: memberInfo.nickname,
      avatar: memberInfo.avatar
    }
    let avatarArr = []
    if(memberInfo.avatar) {
      avatarArr = [{url : memberInfo.avatar}]
    }
    if(!res) {
      this.setState({
        isHasData: false
      })
    } else {
      Object.keys(res).forEach(key => {
        if(res[key].is_open) {
          if(key === 'sex'){
            res[key].items = ['未知', '男', '女']
          }
          if(key === 'birthday'){
            res[key].items = []
          }
          if (memberInfo[key] || memberInfo[key] === 0) {
            // console.log(memberInfo[key])
            if(key === 'sex'){
              res[key].value = ['未知', '男', '女'][memberInfo[key]]
            } else {
              res[key].value = memberInfo[key]
            }
          } else {
            res[key].value = ''
          }
          info[key] = memberInfo[key]
          arr.push({
            key: key,
            element_type: res[key].element_type,
            name: res[key].name,
            value: res[key].value,
            is_required: res[key].is_required,
            items: res[key].items ? res[key].items : null
          })
        }
      })
    }
    // console.log(arr)
    // console.log(avatarArr, 38)
    this.setState({
      info,
      imgs: avatarArr,
      list: arr,
      isHasData: true
    })
  }

  handleImageChange = async (data, type) => {
    if (type === 'remove') {
      this.setState({
        imgs: data
      })

      return
    }

    if (data.length > 1) {
      Taro.showToast({
        title: '最多上传1张图片'
      })
    }
    const imgFiles = data.slice(0, 1)
    azureUploader.uploadImagesFn(imgFiles)
      .then(res => {
        console.log(res)
        this.setState({
          imgs: res
        })
      })
  }

  handleImageClick = () => {
  }

  handleChange = (name, val) => {
    const { info, list } = this.state
    info[name] = val
    // if(name === 'mobile') {
    //   if(val.length === 11 && this.count === 0) {
    //     this.count = 1
    //     this.setState({
    //       imgVisible: true
    //     })
    //   }
    // }

    if(!isString(val) && !isArray(val)) {
      list.map(item => {
        item.key === name ? info[name] = val.detail.value : null
        if(name === 'birthday') {
          item.key === name ? item.value = val.detail.value : null
        } else {
          item.key === name ? (item.items ? item.value = item.items[val.detail.value] : item.value = val.detail.value) : null
        }
      })
    } else if(isArray(val)) {
      list.map(item => {
        let new_option_list = []
        val.map(option_item => {
          if(option_item.ischecked === true) {
            new_option_list.push(option_item.name)
          }
        })
        item.key === name ? item.value = new_option_list.join("，") : null
      })
    } else {
      list.map(item => {
        item.key === name ? item.value = val : null
      })
    }
    this.setState({ list })
  }
  handleSubmit = async (e) => {
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    const { value } = e[0].detail
    const data = {
      ...this.state.info,
      ...value,
      inviter_id: distributionShopId
    }
    try {
      await api.member.setMemberInfo(data)
      Taro.showToast({
        title: '修改成功'
      })
      setTimeout(()=>{
        Taro.redirectTo({
          url: '/pages/member/index'
        })
      }, 500)


    } catch (error) {
      console.log(error)
    }
  }

  handleErrorToastClose = () => {
    S.closeToast()
  }

  showCheckboxPanel = (options, type) => {
    let value = []
    if (isArray(this.state.info[type])) {
      this.state.info[type].forEach(item => {
        if (item.ischecked) {
          value.push(item.name)
        }
      })
    } else {
      value = this.state.info[type] ? this.state.info[type].split(',') : []
    }
    options.forEach(item => {
      if (value.includes(item.name)) {
        item.ischecked = true
      }
    })
    this.setState({
      option_list: options,
      showCheckboxPanel: true
    })
    this.type = type
  }

  handleSelectionChange = (name) => {
    const { option_list } = this.state
    option_list.map(item => {
      if(item.name === name) {
        item.ischecked = !item.ischecked
      }
    })
    this.setState({
      option_list
    })
  }

  // 多选结果确认
  btnClick = (btn_type) => {
    this.setState({
      showCheckboxPanel: false
    })
    const { option_list } = this.state
    if(btn_type === 'cancel') {
      let value = []
      if (isArray(this.state.info[this.type])) {
        this.state.info[this.type].forEach(item => {
          if (item.ischecked) {
            value.push(item.name)
          }
        })
      } else {
        value = this.state.info[this.type] ? this.state.info[this.type].split(',') : []
      }
      // let new_type = this.type
      option_list.map(item => {
        if (value.includes(item.name)) {
          item.ischecked = true
        } else {
          item.ischecked = false
        }
      })
    }
    const list = option_list.map(item => {
      return {
        name: item.name,
        ischecked: item.ischecked
      }
    })
    this.handleChange(this.type, list)
  }


  render () {
    // const { isHasAvator, info, imgs, isHasData, list, option_list, showCheckboxPanel } = this.state
    // const { colors } = this.props
    return (
      <View className='page-member-setting'>
        <NavBar
          title='用户信息'
        />
        <View className='btns'>
          按钮组
        </View>
      </View>
    )
  }
}
