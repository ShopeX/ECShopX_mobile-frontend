import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import _mapKeys from 'lodash/mapKeys'
import { Loading, SpNote, NavBar } from '@/components'
import api from '@/api'
import { withPager, withLogin } from '@/hocs'
import { log, pickBy, resolveOrderStatus, authSetting } from '@/utils'
import TradeItem from './comps/item'

import './invoice-list.scss'

@withPager
@withLogin()
export default class InvoiceList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: []
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  componentWillUnmount () {
  }

  async fetch (params) {
    params = _mapKeys({
      ...params,
    }, function (val, key) {
      if (key === 'page_no') return 'page'
      if (key === 'page_size') return 'pageSize'
      return key
    })

    const { list, total_count: total } = await api.trade.involiceList(params)
    let nList = pickBy(list, {
      tid: 'order_id',
      status_desc: 'order_status_msg',
      status: ({ order_status }) => resolveOrderStatus(order_status),
      totalItems: ({ items }) => items.reduce((acc, item) => (+item.num) + acc, 0),
      payment: ({ total_fee }) => (total_fee / 100).toFixed(2),
      pay_type: 'pay_type',
      point: 'point',
      create_date: 'create_date',
      order: ({ items }) => pickBy(items, {
        order_id: 'order_id',
        item_id: 'item_id',
        pic_path: 'pic',
        title: 'item_name',
        price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
        point: 'item_point',
        num: 'num'
      })
    })

    log.debug('[trade list] list fetched and processed: ', nList)

    this.setState({
      list: [...this.state.list, ...nList]
    })

    return { total }
  }

  handleClickItem = (trade) => {
    const { tid } = trade

    Taro.navigateTo({
      url: `/subpage/pages/trade/detail?id=${tid}`
    })
  }

  handleClickItemBtn = async (type, trade) => {
    const params = { ...trade }
    // console.log(trade, 84)
    switch(type) {
      case 'add-card':
        await Taro.addCard(params)
        break
      case 'open-card':
        await Taro.openCard(params)
        break
    }
  }

  handleClickBtn = async (type) => {
    if(type === 'add-card') {
      const showErr = (title = '下载失败') => {
        return Taro.showToast({
          icon: 'none',
          title
        })
      }
      authSetting('writePhotosAlbum', async () => {
        const { tempFilePath } = await Taro.downloadFile({
          url: 'http://mmbiz.qpic.cn/mmbiz_png/1nDJByqmW2drJSibeWL0bEib2rj4OxG6ep2Y8VggMzP2pSSHVGNW3eIEy9BUiaMfxD4MrWUQ2oVaNEZs4VfQg8tSw/0?wx_fmt=png'
        })

        try {
          await Taro.saveImageToPhotosAlbum({
            filePath: tempFilePath
          })
          Taro.showToast({
            icon: 'success',
            title: '成功保存照片'
          })
        } catch (e) {
          console.log(e)
        }

        // this.handleClickLayer()

      }, () => {
        showErr()
      })
    }
  }

  render () {
    const { list, page } = this.state

    return (
      <View className='page-trade-list page-invoice-list'>
        <NavBar
          title='发票管理'
          leftIconType='chevron-left'
          fixed='true'
        />

        <ScrollView
          scrollY
          className='trade-list__scroll'
          onScrollToLower={this.nextPage}
        >
          {
            list.map((item) => {
              return (
                <TradeItem
                  customFooter
                  payType={item.pay_type}
                  key={item.tid}
                  info={item}
                  onClick={this.handleClickItem.bind(this, item)}
                  onClickBtn={this.handleClickItemBtn}
                  renderFooter={
                    <View className='trade-item__ft'>
                      <Text className='trade-item__status'>已开票</Text>
                    </View>
                  }
                />
              )
            })
          }
          {/*<AtButton
                        circle
                        type='primary'
                        size='small'
                        onClick={this.handleClickBtn.bind(this, 'add-card')}
                      >下载</AtButton>*/}
          {
            page.isLoading && <Loading>正在加载...</Loading>
          }
          {
            !page.isLoading && !page.hasNext && !list.length
              && (<SpNote img='trades_empty.png'>赶快去添加吧~</SpNote>)
          }
        </ScrollView>
      </View>
    )
  }
}
