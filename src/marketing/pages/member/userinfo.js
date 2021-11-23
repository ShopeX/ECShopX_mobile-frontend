import Taro, { Component } from '@tarojs/taro'
import { Input, View, Picker, Image } from '@tarojs/components'
import { SpNavBar, SpCheckbox, SpFloatPrivacy } from '@/components'
import api from '@/api'
import { connect } from '@tarojs/redux'
import S from '@/spx' 
import { showToast, getThemeStyle, styleNames } from '@/utils'
import userIcon from '@/assets/imgs/user-icon.png'
import imgUploader from '@/utils/upload'

import './userinfo.scss'

@connect(
  ({ colors, member }) => ({
    colors: colors.current,
    memberData: member.member
  }),
  (dispatch) => ({
    setMemberInfo: (memberInfo) => dispatch({ type: 'member/init', payload: memberInfo })
  })
)
export default class UserInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userInfo: null,
      option_list: [],
      regParams: null,
      formItems: [],
      // 是否获取过微信信息
      isGetWxInfo: true,
      avatarClickNum: 0,
      showCheckboxPanel: false,
      // 是否显示隐私协议
      // showPrivacy: false,
      // showTimes: 0,
      // 是否获取微信用户信息授权
      // wxUserInfo: true,
      // 是否同意隐私协议
      // isAgree: Taro.getStorageSync('Privacy_agress')
    }

    // option的type
    this.optionsType = ''
  }

  componentDidMount() {
    this.getFormItem()
  }

  config = {
    navigationBarTitleText: '个人信息'
  }

  // 上传头像
  handleAvatar = async () => {
    const { userInfo } = this.state
    if (userInfo.avatar) {
      try {
        const { tempFiles = [] } = await Taro.chooseImage({
          count: 1
        })
        if (tempFiles.length > 0) {
          const imgFiles = tempFiles.slice(0, 1).map((item) => {
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
    } else {
      // if (isAgree == 1) {
        S.OAuthWxUserProfile(() => {
          // this.setState({
          //   showTimes: this.state.showTimes + 1
          // })
          this.getFormItem()
        }, true)
      // } else {
      //   this.setState({
      //     showPrivacy: true,
      //     wxUserInfo: true
      //   })
      // }
    }
  }

  // 获取表单字段
  getFormItem = async () => {
    const { memberInfo } = this.props.memberData
    const { requestFields } = memberInfo
    const userInfo = {
      avatar: memberInfo.avatar,
      ...requestFields
    }

    const data = await api.user.regParam({
      is_edite_page: true
    })

    const formItems = []

    for (let key in data) {
      const item = data[key]
      if (item.is_open) {
        if (key !== 'sex' && key !== 'username' && key !== 'mobile') {
          formItems.push(item)
        }
      }
    }
    this.setState({
      regParams: data,
      formItems,
      userInfo
    })
  }

  // 更换手机号
  editPhone = (e) => {
    e && e.stopPropagation()
    const { regParams } = this.state
    if (regParams.mobile.is_edit) {
      Taro.navigateTo({
        url: '/subpage/pages/auth/bindPhone'
      })
    }
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
    const findIndex = select.findIndex((item) => item === text)
    return findIndex >= 0 ? findIndex : ''
  }

  handleShowCheckboxPanel = (checkItem) => {
    console.log("===handleShowCheckboxPanel",checkItem)
    if(!checkItem.is_edit) return;
    const { userInfo } = this.state
    const { key, checkbox } = checkItem
    this.optionsType = key
    const data = checkbox.map((item) => {
      const optionValue = userInfo[key].find((i) => i.name == item.name && i.ischecked)
      return {
        name: item.name,
        ischecked: !!optionValue
      }
    })
    this.setState({
      option_list: data,
      showCheckboxPanel: true
    })
  }

  handleSelectionChange = (name) => {
    const { option_list } = this.state
    const newData = option_list.map((item) => {
      if (item.name === name) {
        item.ischecked = !item.ischecked
      }
      return item
    })
    this.setState({
      option_list: newData
    })
  }

  btnClick = (btn_type, e) => {
    console.log('btnClick')
    e.stopPropagation()
    this.setState({
      showCheckboxPanel: false
    })
    if (btn_type === 'cancel') {
      this.optionsType = ''
      this.setState({
        option_list: []
      })
    } else {
      const { option_list, userInfo } = this.state
      userInfo[this.optionsType] = option_list
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
    // e && e.stopPropagation();
    const { userInfo, regParams, isAgree } = this.state
    // if (isAgree == 1) {
      try {
        Object.keys(regParams).forEach((key) => {
          if (regParams[key].is_required) {
            if (!userInfo[key]) {
              throw regParams[key].name
            }
          }
        })

        await api.member.setMemberInfo({
          ...userInfo
        })
        showToast('修改成功')

        await S.getMemberInfo()
        // this.props.setMemberInfo({
        //   ...memberInfo
        // });
      } catch (e) {
        showToast(`请完善${e}`)
      }
    // } else {
    //   this.setState({
    //     showPrivacy: true,
    //     wxUserInfo: false
    //   })
    // }
  }

  // privacyOnChange() {
  // this.setState({
  //   isAgree: true
  // }, () => {
  // if (this.state.wxUserInfo) {
  //   this.getFormItem()
  // } else {
  //   this.saveInfo()
  // }
  // })
  // }

  render() {
    const {
      formItems,
      userInfo,
      regParams,
      showCheckboxPanel,
      option_list,
      // showPrivacy,
      // wxUserInfo
    } = this.state
    const { colors, memberData } = this.props

    console.log('--userInfo--', userInfo)
    console.log('--formItems--', formItems)
    if (!userInfo) {
      return null
    }

    return (
      <View className='page-member-setting' style={styleNames(getThemeStyle())}>
        <SpNavBar title='用户信息' />
        <View className='baseInfo'>
          <View className='item'>
            <View className='left'>我的头像</View>
            <View className='right'>
              <Image
                src={userInfo.avatar || userIcon}
                mode='aspectFill'
                className='avatar'
                onClick={this.handleAvatar.bind(this)}
              />
            </View>
          </View>

          <View className='item' onClick={this.editPhone.bind(this)}>
            <View className='left'>我的手机号</View>
            <View className='right'>{userInfo.mobile}</View>
          </View>

          <View className='item'>
            <View className='left'>{regParams.username.name}</View>
            <View className='right'>
              <Input
                className='input'
                placeholder={regParams.username.required_message}
                value={userInfo.username}
                onInput={this.handleInput.bind(this, 'username')}
                disabled={!regParams.username.is_edit}
              />
            </View>
          </View>

          {regParams.sex && regParams.sex.is_open && (
            <View className='item'>
              <View className='left'>{regParams.sex.name}</View>
              <View className='right'>
                <Picker
                  mode='selector'
                  disabled={!regParams.sex.is_edit}
                  range={regParams.sex.select}
                  value={this.textToIndex(userInfo.sex, regParams.sex.select)}
                  onChange={this.pickerChange.bind(this, regParams.sex)}
                >
                  <View className='picker'>{userInfo.sex || regParams.sex.required_message}</View>
                </Picker>
              </View>
            </View>
          )}
        </View>

        {/* 基础信息 */}
        <View className='basicInfo'>
          <View className='title'>基础信息</View>
          {formItems.map((item) => (
            <View key={item.key} className='item'>
              <View className='left'>{item.name}</View>
              <View className='right'>
                {/* 文本 */}
                {item.field_type === 1 && (
                  <Input
                    className='input'
                    value={userInfo[item.key]}
                    placeholder={item.required_message}
                    onInput={this.handleInput.bind(this, item.key)}
                    // disabled={!item.is_edit && item.isInitValue}
                    disabled={!item.is_edit}
                  />
                )}
                {/* 数字 */}
                {item.field_type === 2 && (
                  <Input
                    className='input'
                    value={userInfo[item.key]}
                    type='number'
                    max={item.range.end}
                    min={item.range.start}
                    placeholder={item.required_message}
                    onInput={this.handleInput.bind(this, item.key)}
                    disabled={!item.is_edit}
                  />
                )}
                {/* 日期 */}
                {item.field_type === 3 && (
                  <Picker
                    mode='date'
                    disabled={!item.is_edit}
                    value={userInfo[item.key]}
                    onChange={this.pickerChange.bind(this, item)}
                  >
                    <View className='picker'>{userInfo[item.key] || item.required_message}</View>
                  </Picker>
                )}
                {/* 单选 */}
                {item.field_type === 4 && (
                  <Picker
                    mode='selector'
                    disabled={!item.is_edit}
                    value={this.textToIndex(userInfo[item.key], item.select)}
                    range={item.select}
                    onChange={this.pickerChange.bind(this, item)}
                  >
                    <View className='picker'>{userInfo[item.key] || item.required_message}</View>
                  </Picker>
                )}
                {/* 多选 */}
                {item.field_type === 5 && (
                  <View onClick={this.handleShowCheckboxPanel.bind(this, item)}>
                    {userInfo[item.key]
                      ? this.showCheckBoxItem(userInfo[item.key])
                      : item.required_message}
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View className='btns'>
          <View
            className='btn save'
            style={`background: ${colors.data[0].primary}`}
            onClick={this.saveInfo.bind(this)}
          >
            保存
          </View>
        </View>

        {showCheckboxPanel ? (
          <View className='mask' onClick={this.btnClick.bind(this, 'cancel')}>
            <View className='checkBoxPanel' onClick={(e) => e.stopPropagation()}>
              <View className='panel-btns'>
                <View className='panel-btn cancel-btn' onClick={this.btnClick.bind(this, 'cancel')}>
                  取消
                </View>
                <View
                  className='panel-btn require-btn'
                  style={`color: ${colors.data[0].primary}`}
                  onClick={this.btnClick.bind(this, 'require')}
                >
                  确定
                </View>
              </View>
              <View className='checkBoxPanel-content'>
                {option_list.map((item, index) => {
                  return (
                    <View
                      className='checkBoxPanel-item'
                      key={`checkBoxPanel${index}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SpCheckbox
                        checked={item.ischecked}
                        onChange={this.handleSelectionChange.bind(this, item.name)}
                      >
                        <View>{item.name}</View>
                      </SpCheckbox>
                    </View>
                  )
                })}
              </View>
            </View>
          </View>
        ) : null}

        {/* <SpFloatPrivacy
          isOpened={showPrivacy}
          wxUserInfo={wxUserInfo}
          onClose={() =>
            this.setState({
              showPrivacy: false,
              showTimes: this.state.showTimes + 1
            })
          }
          onChange={this.privacyOnChange.bind(this)}
        /> */}
      </View>
    )
  }
}
