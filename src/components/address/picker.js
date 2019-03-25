import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import { SpCell, SpToast, SpNote } from '@/components'
import { classNames, log } from '@/utils'
import api from '@/api'
import find from 'lodash/find'
import AddressEdit from './edit'
import S from '@/spx'


import './picker.scss'

export default class AddressPicker extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    onClickBack: () => {}
  }

  constructor (props) {
    super(props)

    this.state = {
      list: [],
      mode: 'default',
      curAddress: null
    }
  }

  componentDidMount () {
    this.fetch(() => this.changeSelection())
  }

  async fetch (cb) {
    Taro.showLoading({
      mask: true
    })
    const { list } = await api.member.addressList()
    Taro.hideLoading()

    this.setState({
      list
    }, () => {
      cb && cb(list)
    })
  }

  changeSelection (params = {}) {
    if (!params || !params.address_id) {
      this.props.onChange(null)
      return
    }

    const { address_id } = params
    const { list } = this.state
    const address = find(list, addr => address_id ? address_id === addr.address_id : addr.def_addr > 0) || list[0] || null

    log.debug('[address picker] change selection: ', address)
    this.props.onChange(address)
  }

  handleGoBack = () => {
    this.setState({
      mode: 'default',
      curAddress: null
    })
    this.props.onClickBack()
  }

  handleClickAddress = (address, e) => {
    this.changeSelection(address)
    this.props.onClickBack()
  }

  handleRetrieveWxAddress = async () => {
    const res = await Taro.chooseAddress()
    const { errMsg } = res
    if (errMsg === 'chooseAddress:ok') {
      log.debug(`[wx chooseAddress] address:`, res)
    } else if (errMsg.indexOf('auth deny') >= 0) {
      log.debug(`[wx chooseAddress] error: ${errMsg}`)
    }

    console.info('unkown error, res:', res)
  }

  handleSaveAddress = async (address) => {
    try {
      await api.member.addressCreateOrUpdate(address)
      if(address.address_id) {
        S.toast('修改成功')
      } else {
        S.toast('创建成功')
      }

      await this.fetch(() => {
        // update current address
        const params = this.props.value ? { ...this.props.value } : null
        this.changeSelection(params)
      })

      this.exitEdit()
    } catch (error) {
      return false
    }


  }

  handleDelAddress = async (address) => {
    const { address_id } = address
    await api.member.addressDelete(address_id)
    const list = this.state.list.filter(addr => addr.address_id !== address_id)
    const isDeleteCurAddress = this.state.curAddress && this.state.curAddress.address_id === address.address_id

    this.setState({
      list
    }, () => {
      if (isDeleteCurAddress) {
        this.changeSelection()
      }
    })
    this.exitEdit()
  }

  enterEdit (address = null, e) {
    if (e) {
      e.stopPropagation()
    }
    this.setState({
      mode: 'edit',
      curAddress: address,
    })
  }

  exitEdit = () => {
    this.setState({
      mode: 'default',
      curAddress: null
    })
  }

  render () {
    const { isOpened } = this.props
    const { mode, curAddress, list } = this.state

    return (
      <View className={classNames('address-picker', isOpened ? 'address-picker__active' : null)}>
        {
          mode !== 'edit'
            ? <AtNavBar
              leftIconType='chevron-left'
              rightFirstIconType='add-circle'
              title='选择地址'
              onClickLeftIcon={this.handleGoBack}
              onClickRgIconSt={this.enterEdit.bind(this)}
            />
            : <AtNavBar
              leftIconType='chevron-left'
              title='编辑地址'
              onClickLeftIcon={this.exitEdit}
            />
        }

        {
          mode !== 'edit'
            ? <View>
                {
                  (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) && (
                    <View className='sec'>
                      <SpCell
                        isLink
                        iconPrefix='sp-icon'
                        icon='weixin'
                        title='获取微信收货地址'
                        onClick={this.handleRetrieveWxAddress}
                      />
                    </View>)
                }
                <View className='sec address-list'>
                  {
                    list.map(item => {
                      return (
                        <SpCell
                          key={item.address_id}
                          onClick={this.handleClickAddress.bind(this, item)}
                        >
                          <View className='address-item'>
                            <Text className='address-item__receiver'>
                              <Text className='address-item__name'>{item.username}</Text>
                              <Text className='address-item__mobile'>{item.telephone}</Text>
                              <Text className='address-item__addr'>{item.province}{item.city}{item.county}{item.adrdetail}</Text>
                            </Text>
                            <Text
                              className='address-item__ft'
                              onClick={this.enterEdit.bind(this, item)}
                            >编辑</Text>
                          </View>
                        </SpCell>
                      )
                    })
                  }
                </View>

                {
                  list.length === 0 && (
                    <SpNote
                      img='address_empty.png'
                    >赶快添加新地址吧~</SpNote>
                  )
                }
              </View>
            : <AddressEdit
              value={curAddress}
              onChange={this.handleSaveAddress}
              onDelete={this.handleDelAddress}
              onClose={this.exitEdit}
            />
        }

        <SpToast />
      </View>
    )
  }
}
