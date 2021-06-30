import Taro, { Component } from '@tarojs/taro'
import { Input, View, Picker, Image } from '@tarojs/components'
import { NavBar, SpCheckbox } from '@/components'
import api from '@/api'
import { connect } from "@tarojs/redux"
import S from '@/spx'
import { withLogin } from '@/hocs'
import userIcon from "@/assets/imgs/user-icon.png";
import imgUploader from '@/utils/upload'
import GetUserInfoBtn from './comps/getUserInfo'

import './userinfo.scss'

@connect(( { colors } ) => ({
  colors: colors.current
}), () => ({}))
@withLogin()
export default class UserInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userInfo: {},
      baseInfo: {
        sex: {
          name: '性别',
          select: ['未知', '男', '女'],
          required_message: '性别必填'
        },
        username: {
          name: '姓名'
        }
      },
      option_list: [],
      formItems: [],
      // 是否获取过微信信息
      isGetWxInfo: true,
      showCheckboxPanel: false
    }

    // option的type
    this.optionsType = ''
  }

  componentDidMount () {
    console.log("componentDidMount")
    this.getFormItem()
  }

  config = {
    navigationBarTitleText: '个人信息'
  }

  // 获取微信用户信息
  getWxUserInfo = (res) => {
    const { userInfo, baseInfo } = this.state
    if (res.detail) {
      const { userInfo: wxInfo } = res.detail
      userInfo.avatar = wxInfo.avatarUrl
      userInfo.username = wxInfo.nickName
      userInfo.country = wxInfo.country
      userInfo.city = wxInfo.city
      userInfo.province = wxInfo.province
      userInfo.sex = baseInfo.sex.select[wxInfo.gender]
    }
    this.setState({
      isGetWxInfo: true
    })
  }

  // 上传头像
  handleAvatar = async () => {
    const { isGetWxInfo, userInfo } = this.state
    if (isGetWxInfo) {
      try {
        const { tempFiles = [] } = await Taro.chooseImage({
          count: 1
        }) 
        if (tempFiles.length > 0) {
          const imgFiles = tempFiles.slice(0, 1).map(item => {
            return {
              file: item,
              url: item.path
            }
          })
          const res = await imgUploader.uploadImageFn(imgFiles)
          userInfo.avatar = res[0].url
          this.setState({
            userInfo
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  // 获取表单字段
  getFormItem = async () => {
    
    const { memberInfo } = await api.member.memberInfo()
    const userInfo = {
      avatar: memberInfo.avatar,
      mobile: memberInfo.mobile,
      username: memberInfo.username
    }
    const data = await api.user.regParam({
      is_edite_page: true
    })
    const { baseInfo } = this.state
    const normalFiled = []
    for (let key in data) {
      const item = data[key]
      // 是否有初始值
      if (item.is_open) {
        userInfo[key] = (() => {
          switch (item.field_type) {
            case 5:
              return memberInfo.requestFields[key] || []
            default:
              return memberInfo.requestFields[key] || ''
          }
        })()
        // 是否拥有初始值
        const isInitValue = Array.isArray(userInfo[key]) ? userInfo[key].length > 0 : !!userInfo[key]
        if (key !== 'sex' && key !== 'username' && key !== 'mobile') {
          normalFiled.push({ ...item, isInitValue })
        } else {
          baseInfo[key] = { ...item, isInitValue }
        }
      }
    }
    this.setState({
      formItems: normalFiled,
      copyOldFormItems: data,
      isGetWxInfo: memberInfo.isGetWxInfo,
      userInfo,
      baseInfo
    })
  }

  // 退出登录
  loginOut = () => {
    S.logout()
    Taro.redirectTo({
      url: '/subpage/pages/auth/wxauth?source=loginout'
    })
  }

  // 更换手机号
  editPhone = (e) =>{
    e && e.stopPropagation()
    const { baseInfo } = this.state
    if (baseInfo.mobile && !baseInfo.mobile.is_edit) return false
    Taro.navigateTo({
      url: '/subpage/pages/auth/bindPhone'
    })
  }

  // 输入
  handleInput = (type, e) => {
    const { detail } = e
    const { userInfo } = this.state
    userInfo[type] = detail.value
    this.setState({
      userInfo
    })
  }

  // 选择
  pickerChange = (selectItem, e) => {
    const { detail } = e
    const { userInfo } = this.state
    const { key, field_type, select } = selectItem
    if (field_type === 4) {      
      userInfo[key] = select[detail.value]
    } else {
      userInfo[key] = detail.value
    }
    this.setState({
      userInfo
    })
  }

  // 文字转下标
  textToIndex = (text, select) => {
    const findIndex = select.findIndex(item => item === text)
    return findIndex >= 0 ? findIndex : ''
  }

  handleShowCheckboxPanel = (checkItem) => {
    const { userInfo } = this.state
    const { key, is_edit, checkbox, isInitValue } = checkItem
    if (!is_edit && isInitValue) return false
    this.optionsType = key
    const data = checkbox.map(item => {
      const itemUserInfo = userInfo[key].find(i => i.name === item.name)
      return {
        name: item.name,
        ischecked: itemUserInfo ? itemUserInfo.ischecked : false
      }
    })
    this.setState({
      option_list: data,
      showCheckboxPanel: true
    })
  }

  handleSelectionChange = (name) => {
    const { option_list } = this.state
    const newData = option_list.map(item => {
      if(item.name === name) {
        item.ischecked = !item.ischecked
      }
      return item
    })
    this.setState({
      option_list: newData
    })
  }

  btnClick = (btn_type, e) => {
    console.log("btnClick") 
    
    e.stopPropagation()
    this.setState({
      showCheckboxPanel: false
    })
    if(btn_type === 'cancel') {
      this.optionsType = ''
      this.setState({
        option_list: []
      })
    } else {
      const { option_list, userInfo } = this.state
      userInfo[this.optionsType] = [...option_list]
      this.setState({
        userInfo,
        option_list: []
      })
    }

  }

  // checkbox显示
  showCheckBoxItem = (checkBoxs = []) => {
    const data = []
    for (let i = 0; i < checkBoxs.length; i++) {
      if (checkBoxs[i].ischecked) {
        data.push(checkBoxs[i].name)
      }
    }
    return data.join(',')
  }


  // 保存用户信息
  saveInfo = async (e) => {
    e && e.stopPropagation()
    const { userInfo, copyOldFormItems, isGetWxInfo } = this.state
    const data = { ...userInfo }
    for (let key in copyOldFormItems) {
      const item = copyOldFormItems[key]
      if (!item.is_edit) { continue }
      if (item.is_open && item.is_required && !data[key]) {
        Taro.showToast({
          title: `请完善${item.name}`,
          icon: 'none'
        })
        return false
      }
    }
    await api.member.setMemberInfo({
      ...data,
      isGetWxInfo
    })
    Taro.showToast({
      title: '修改成功',
      mask: true
    })
    console.log("saveInfo")
    this.getFormItem()
  }

  render () {
    const { formItems, userInfo, isGetWxInfo, baseInfo, showCheckboxPanel, option_list } = this.state
    const { colors } = this.props

    console.log("--userInfo--",userInfo)

    return (
      <View className="page-member-setting">
        <NavBar title="用户信息" />
        <View className="baseInfo">
          <GetUserInfoBtn
            isGetUserInfo={isGetWxInfo}
            onGetUserInfo={this.getWxUserInfo.bind(this)}
          >
            <View className="item">
              <View className="left">我的头像</View>
              <View className="right">
                <Image
                  src={userInfo.avatar || userIcon}
                  mode="aspectFill"
                  className="avatar"
                  onClick={this.handleAvatar.bind(this)}
                />
              </View>
            </View>
            <View className="item" onClick={this.editPhone.bind(this)}>
              <View className="left">我的手机号</View>
              <View className="right">{userInfo.mobile}</View>
            </View>
            <View className="item">
              <View className="left">{baseInfo.username.name}</View>
              <View className="right">
                {isGetWxInfo ? (
                  <Input
                    className="input"
                    placeholder={baseInfo.username.required_message}
                    value={userInfo.username}
                    onInput={this.handleInput.bind(this, "username")}
                    disabled={
                      !baseInfo.username.is_edit &&
                      baseInfo.username.isInitValue
                    }
                  />
                ) : (
                  userInfo.username || "未知"
                )}
              </View>
            </View>
            {baseInfo.sex.is_open && (
              <View className="item">
                <View className="left">{baseInfo.sex.name}</View>
                <View className="right">
                  {isGetWxInfo ? (
                    <Picker
                      mode="selector"
                      disabled={
                        !baseInfo.sex.is_edit && baseInfo.sex.isInitValue
                      }
                      value={this.textToIndex(
                        userInfo.sex,
                        baseInfo.sex.select
                      )}
                      range={baseInfo.sex.select}
                      onChange={this.pickerChange.bind(this, baseInfo.sex)}
                    >
                      <View className="picker">
                        {userInfo.sex || baseInfo.sex.required_message}
                      </View>
                    </Picker>
                  ) : (
                    `${userInfo.sex || baseInfo.sex.required_message}`
                  )}
                </View>
              </View>
            )}
          </GetUserInfoBtn>
        </View>
        <View className="basicInfo">
          <View className="title">基础信息</View>
          {formItems.map(item => (
            <View key={item.key} className="item">
              <View className="left">{item.name}</View>
              <View className="right">
                {item.field_type === 1 && (
                  <Input
                    className="input"
                    value={userInfo[item.key]}
                    placeholder={item.required_message}
                    onInput={this.handleInput.bind(this, item.key)}
                    disabled={!item.is_edit && item.isInitValue}
                  />
                )}
                {item.field_type === 2 && (
                  <Input
                    className="input"
                    value={userInfo[item.key]}
                    type="number"
                    max={item.range.end}
                    min={item.range.start}
                    placeholder={item.required_message}
                    onInput={this.handleInput.bind(this, item.key)}
                    disabled={!item.is_edit && item.isInitValue}
                  />
                )}
                {item.field_type === 3 && (
                  <Picker
                    mode="date"
                    disabled={!item.is_edit && item.isInitValue}
                    value={userInfo[item.key]}
                    onChange={this.pickerChange.bind(this, item)}
                  >
                    <View className="picker">
                      {userInfo[item.key] || item.required_message}
                    </View>
                  </Picker>
                )}
                {item.field_type === 4 && (
                  <Picker
                    mode="selector"
                    disabled={!item.is_edit && item.isInitValue}
                    value={this.textToIndex(userInfo[item.key], item.select)}
                    range={item.select}
                    onChange={this.pickerChange.bind(this, item)}
                  >
                    <View className="picker">
                      {userInfo[item.key] || item.required_message}
                    </View>
                  </Picker>
                )}
                {item.field_type === 5 && (
                  <View onClick={this.handleShowCheckboxPanel.bind(this, item)}>
                    {userInfo[item.key].length > 0
                      ? this.showCheckBoxItem(userInfo[item.key])
                      : item.required_message}
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
        <View className="btns">
          <View className="btn loginOut" onClick={this.loginOut.bind(this)}>
            退出登录
          </View>
          <View
            className="btn save"
            style={`background: ${colors.data[0].primary}`}
            onClick={this.saveInfo.bind(this)}
          >
            保存
          </View>
        </View>
        {showCheckboxPanel ? (
          <View className="mask" onClick={this.btnClick.bind(this, "cancel")}>
            <View className="checkBoxPanel" onClick={e => e.stopPropagation()}>
              <View className="panel-btns">
                <View
                  className="panel-btn cancel-btn"
                  onClick={this.btnClick.bind(this, "cancel")}
                >
                  取消
                </View>
                <View
                  className="panel-btn require-btn"
                  style={`color: ${colors.data[0].primary}`}
                  onClick={this.btnClick.bind(this, "require")}
                >
                  确定
                </View>
              </View>
              <View className="checkBoxPanel-content">
                {option_list.map((item, index) => {
                  return (
                    <View
                      className="checkBoxPanel-item"
                      key={`checkBoxPanel${index}`}
                      onClick={e => e.stopPropagation()}
                    >
                      <SpCheckbox
                        checked={item.ischecked}
                        onChange={this.handleSelectionChange.bind(
                          this,
                          item.name
                        )}
                      >
                        <View>{item.name}</View>
                      </SpCheckbox>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
