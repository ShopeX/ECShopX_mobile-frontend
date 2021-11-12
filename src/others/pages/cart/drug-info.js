import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtInput, AtImagePicker } from 'taro-ui'
import S from '@/spx'
import req from '@/api/req'

import './drug-info.scss'

@connect(
  ({ cart }) => ({
    curDrugInfo: cart.drugInfo
  }),
  (dispatch) => ({
    onChangeDrugInfo: (drugInfo) => dispatch({ type: 'cart/changeDrugInfo', payload: drugInfo })
  })
)
export default class DrugInfo extends Component {
  static defaultProps = {}

  static options = {
    addGlobalClass: true
  }

  constructor(props) {
    super(props)

    this.state = {
      info: {},
      imgInfo: {}
    }
  }
  componentDidMount() {
    const { curDrugInfo } = this.props
    const { info, imgInfo } = this.state
    if (info && imgInfo) {
      info.drug_buyer_name = curDrugInfo.drug_buyer_name
      info.drug_buyer_id_card = curDrugInfo.drug_buyer_id_card
      imgInfo.drug_list_image = curDrugInfo.drug_list_image
    }
    this.setState({
      info,
      imgInfo
    })
  }

  uploadURLFromRegionCode = (code) => {
    let uploadURL = null
    switch (code) {
      case 'z0':
        uploadURL = 'https://up.qiniup.com'
        break
      case 'z1':
        uploadURL = 'https://up-z1.qiniup.com'
        break
      case 'z2':
        uploadURL = 'https://up-z2.qiniup.com'
        break
      case 'na0':
        uploadURL = 'https://up-na0.qiniup.com'
        break
      case 'as0':
        uploadURL = 'https://up-as0.qiniup.com'
        break
      default:
        console.error('please make the region is with one of [z0, z1, z2, na0, as0]')
    }
    return uploadURL
  }

  handleInfoChange = (name, val) => {
    const { info } = this.state
    info[name] = val
    this.setState({
      info
    })
  }

  handleSubmitClick = () => {
    const { info, imgInfo } = this.state
    if (!info || !imgInfo) {
      return
    }
    const drugInfo = Object.assign(info, imgInfo)
    this.props.onChangeDrugInfo(drugInfo)
    setTimeout(() => {
      Taro.navigateBack()
    }, 700)
  }

  handleImageChange = async (data, type) => {
    if (type === 'remove') {
      this.setState({
        imgInfo: {
          drug_list_image: data
        }
      })
      return
    }

    if (data.length > 3) {
      S.toast('最多上传3张图片')
    }
    const imgFiles = data.slice(0, 3)
    let promises = []

    for (let item of imgFiles) {
      const promise = new Promise(async (resolve, reject) => {
        if (!item.file) {
          resolve(item)
        } else {
          const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
          const { region, token, key, domain } = await req.get('/espier/image_upload_token', {
            filesystem: 'qiniu',
            filetype: 'aftersales',
            filename
          })

          let uploadUrl = this.uploadURLFromRegionCode(region)
          Taro.uploadFile({
            url: uploadUrl,
            filePath: item.url,
            name: 'file',
            formData: {
              'token': token,
              'key': key
            },
            success: (res) => {
              let imgData = JSON.parse(res.data)
              resolve({
                url: `${domain}/${imgData.key}`
              })
            },
            fail: (error) => reject(error)
          })
        }
      })
      promises.push(promise)
    }

    const results = await Promise.all(promises)
    this.setState({
      imgInfo: {
        drug_list_image: results
      }
    })
  }
  handleImageClick = () => {}

  render() {
    const { info, imgInfo } = this.state
    return (
      <View class='drug-info'>
        <AtInput
          title='用药人姓名'
          className='trade-remark__input'
          value={info.drug_buyer_name}
          onChange={this.handleInfoChange.bind(this, 'drug_buyer_name')}
        />
        <AtInput
          title='用药人身份证'
          className='trade-remark__input'
          placeholder='请输入有效的身份证号'
          value={info.drug_buyer_id_card}
          onChange={this.handleInfoChange.bind(this, 'drug_buyer_id_card')}
        />
        <View className='drug-describe'>
          <View className='drug-describe__img'>
            <Text className='drug-describe__text'>上传处方单</Text>
            <View className='drug-describe__imgupload'>
              <AtImagePicker
                mode='aspectFill'
                multiple
                count={3}
                length={3}
                files={imgInfo.drug_list_image}
                onChange={this.handleImageChange.bind(this)}
                onImageClick={this.handleImageClick}
              >
                {' '}
              </AtImagePicker>
            </View>
          </View>
        </View>
        <AtButton type='primary' onClick={this.handleSubmitClick.bind(this)}>
          确定
        </AtButton>
      </View>
    )
  }
}
