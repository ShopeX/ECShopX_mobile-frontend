import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAvatar, AtTextarea, AtButton, AtImagePicker } from 'taro-ui'
import { Loading } from '@/components'
import api from '@/api'

import './complaint.scss'

export default class Complaint extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: null,
      files: [],
      complaintReason: ''
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    let info = await api.member.getSalesperson();

    console.log('res', info)

    this.setState({ info })
  }

  /**
   * 起诉理由输入
   * */
  handleChangeReason(e) {
    this.setState({
      complaintReason: e
    })
  }

  /**
   * 图片上传
   * */
  handleChangeUploadImg(files) {
    this.setState({
      files
    })
  }

  /**
   * 图片上传失败
   * */
  handleChangeUploadError(mes) {
    console.log('图片上传失败', mes)
  }

  /**
   * 投诉
   *  */
  async handleClickButton() {
    let { complaintReason: complaints_content, files } = this.state;

    if (!complaints_content) {
      Taro.showToast({
        title: '投诉内容不能为空',
        icon: 'none'
      })
      return
    }

    let nFiles = files.map(item => {
      return item.url
    })

    let params = {
      complaints_content,
      complaints_images: nFiles.join()
    }

    await api.member.setComplaints(params);

    await Taro.showToast({
      title: '投诉成功',
      icon: 'none'
    })

    Taro.redirectTo({
      url: '/pages/member/index'
    })
  }

  render() {
    const { info, complaintReason, files } = this.state

    if (!info) {
      return <Loading />
    }

    return (
      <View className='page-complaint'>
        <View className='pege-header'>
          <View>投书对象：</View>
          <View className='flex exclusive-header'>
            <View className='exclusive-header__avatar'>
              <AtAvatar image={info.avatar}
                size='normal'
                circle
              />
            </View>
            <View className='exclusive-header__info'>
              <View className='exclusive-header__info-name'>
                {info.name}
              </View>
              <View className='exclusive-header__info-store_name'>
                {info.distributor.store_name}
              </View>
            </View>
          </View>
        </View>

        <View className='complaint-reason'>
          <View>投诉理由：</View>
          <AtTextarea
            className='complaint-reason__textarea'
            value={complaintReason}
            onChange={this.handleChangeReason.bind(this)}
            maxLength={200}
            height={300}
            placeholder='投诉内容'
          />
        </View>

        <View className='complaint-upload'>
          <View>上传图片：</View>
          <AtImagePicker
            multiple
            files={files}
            count={9}
            onFail={this.handleChangeUploadError.bind(this)}
            onChange={this.handleChangeUploadImg.bind(this)}
          />
        </View>

        <View className='complaint-button'>
          <AtButton
            type='primary'
            circle
            size='normal'
            onClick={this.handleClickButton.bind(this)}
          >
            按钮文案
            </AtButton>
        </View>
      </View>
    )
  }
}
