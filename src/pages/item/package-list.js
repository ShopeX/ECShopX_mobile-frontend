import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, SpNote, GoodsBuyPanel } from '@/components'
import PackageItem from './comps/package-item'
import api from '@/api'
import { pickBy } from '@/utils'

import './package-list.scss'

@withPager
@withBackToTop
export default class PackageList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      query: null,
      currentPackage: 0,
      info: null,
      buyPanelType: null,
      showBuyPanel: false,
      curSku: null,
      list: []
    }
  }

  config = {
    navigationBarTitleText: '优惠组合'
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const { id } = this.$router.params
    const { currentPackage } = this.state
    const query = {
      item_id: id,
      page,
      pageSize
    }
    const { list, total_count: total } = await api.item.packageList(query)

    const nList = pickBy(list, {
      package_id: 'package_id',
      package_name: 'package_name',
      open: false
    })

    this.setState({
      list: [...this.state.list, ...nList],
      query
    })

    if (!currentPackage) {
      this.setState({
        currentPackage: nList[0].package_id
      })
    }

    return {
      total
    }
  }

  handleItemClick = (id) => {
    this.setState({
      currentPackage: id
    })
  }

  handleBuyAction = (type) => {
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: '请先登录再购买',
        icon: 'none'
      })

      setTimeout(() => {
        S.login(this)
      }, 2000)

      return
    }

    this.setState({
      showBuyPanel: true,
      buyPanelType: type
    })
  }

  handleSkuChange = (curSku) => {
    this.setState({
      curSku
    })
  }

  handleCartAdd = () => {
    console.log(111)
  }

  handleShowBuyPanel = (data) => {
    this.setState({
      info: data,
      showBuyPanel: true,
      buyPanelType: 'cart'
    }, () => {
      const { info } = this.state
      console.log(info)
    })
  }

  render () {
    const { list, showBackToTop, scrollTop, page, currentPackage, buyPanelType } = this.state

    return (
      <View className='page-package-goods'>
        <ScrollView
          className='package-goods__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
            <View className='package-goods__list'>
              {
                list.map(item => {
                  return (
                    <View
                      className='package-goods__item'
                      key={item.package_id}
                    >
                      <PackageItem
                        info={item}
                        current={currentPackage}
                        onClick={this.handleItemClick.bind(this, item.package_id)}
                        onAddCart={this.handleCartAdd.bind(this)}
                        onShowBuyPanel={this.handleShowBuyPanel.bind(this)}
                      />
                    </View>
                  )
                })
              }
            </View>
          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
          }
          {
            !page.isLoading && !page.hasNext && !list.length
              && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </ScrollView>

        {
          info &&
          <GoodsBuyPanel
            info={info}
            type={buyPanelType}
            isOpened={showBuyPanel}
            onClose={() => this.setState({ showBuyPanel: false })}
            onChange={this.handleSkuChange}
            onAddCart={this.handleBuyAction.bind(this, 'cart')}
            onFastbuy={this.handleBuyAction.bind(this, 'fastbuy')}
          />
        }

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
      </View>
    )
  }
}
