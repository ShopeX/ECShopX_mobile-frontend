import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import {AtButton, AtForm, AtImagePicker, AtInput} from 'taro-ui'
import { NavBar, SpToast } from '@/components'
import api from '@/api'
import req from '@/api/req'
import { withLogin } from '@/hocs'
import S from '@/spx'
import azureUploader from '@/utils/azure-wry'
// import AzureStorage from 'azure-storage/browser/azure-storage.blob.export'

import './userinfo.scss'

function resolveBlobFromFile (url, type) {
  return fetch(url)
    .then(res => res.blob())
    .then(blob => blob.slice(0, blob.size, type))
}

@withLogin()
export default class UserInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isHasAvator: true,
      imgs: [],
      info: {},
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { memberInfo } = await api.member.memberInfo()
    let avatarArr = []
    if(memberInfo.avatar) {
      avatarArr = [{url : memberInfo.avatar}]
    }
    console.log(avatarArr, 38)
    this.setState({
      info: {
        user_name: memberInfo.username,
        avatar: memberInfo.avatar
      },
      imgs: avatarArr
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
      S.toast('最多上传1张图片')
    }
    const imgFiles = data.slice(0, 1)
    // azureUploader.uploadImageFn(imgFiles, '/espier/image_upload_token', 'qiniu', 'aftersales')
    //   .then(res => {
    //     this.setState({
    //       imgs: res
    //     })
    //   })
  }

  handleImageClick = () => {
  }

  handleChange = (name, val) => {
    const { info } = this.state
    info[name] = val
  }

  handleSubmit = async (e) => {
    const { value } = e.detail
    const data = {
      ...this.state.info,
      ...value
    }
    try {
      await api.member.setMemberInfo(data)
      S.toast('修改成功')
      setTimeout(()=>{
        Taro.redirectTo({
          url: '/pages/member/index'
        })
      }, 500)


    } catch (error) {
      console.log(error)
    }
  }

  render () {
    const { isHasAvator, info, imgs } = this.state

    return (
      <View class='page-member-setting'>
        <NavBar
          title='用户信息'
        />

        <AtForm
          onSubmit={this.handleSubmit}
        >
          <View className='sec auth-login__form'>
            <View className='avatar-user'>
              <View className='avatar-user-text'>头像</View>
              <AtImagePicker
                showAddBtn={isHasAvator}
                mode='aspectFill'
                length={1}
                files={imgs}
                onChange={this.handleImageChange}
                onImageClick={this.handleImageClick}
              > </AtImagePicker>
            </View>
            <AtInput
              title='昵称'
              value={info.user_name}
              placeholder='请输入昵称'
              onFocus={this.handleErrorToastClose}
              onChange={this.handleChange.bind(this, 'user_name')}
            />
          </View>

          <View className='btns'>
            {
              process.env.TARO_ENV === 'weapp'
                ? <AtButton type='primary' formType='submit'>保存</AtButton>
                : <AtButton type='primary' onClick={this.handleSubmit} formType='submit'>保存</AtButton>
            }
          </View>
        </AtForm>
        <SpToast />
      </View>
    )
  }
}
