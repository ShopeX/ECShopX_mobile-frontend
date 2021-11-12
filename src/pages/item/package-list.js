import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, SpNote } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import PackageItem from './comps/package-item'

import './package-list.scss'

@withPager
@withBackToTop
export default class PackageList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      currentPackage: 0,
      list: []
    }
  }

  config = {
    navigationBarTitleText: '优惠组合'
  }

  componentDidMount() {
    this.nextPage()
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const { id } = this.$router.params
    const { currentPackage } = this.state
    const query = {
      item_id: id,
      page,
      pageSize
    }
    const { list, total_count: total } = await api.item.packageList(query)

    if (list.length) {
      const nList = pickBy(list, {
        package_id: 'package_id',
        package_name: 'package_name',
        open: false
      })

      this.setState({
        list: [...this.state.list, ...nList]
      })

      if (!currentPackage) {
        this.setState({
          currentPackage: nList[0].package_id
        })
      }
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

  render() {
    const { list, showBackToTop, scrollTop, page, currentPackage, buyPanelType } = this.state
    const { distributor_id } = this.$router.params
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
            {list.map((item) => {
              return (
                <View className='package-goods__item' key={item.package_id}>
                  <PackageItem
                    info={item}
                    distributorId={distributor_id}
                    current={currentPackage}
                    onClick={this.handleItemClick.bind(this, item.package_id)}
                  />
                </View>
              )
            })}
            {page.isLoading ? <Loading>正在加载...</Loading> : null}
            {!page.isLoading && !page.hasNext && !list.length && (
              <SpNote img='trades_empty.png'>活动已结束~</SpNote>
            )}
          </View>
        </ScrollView>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} />
      </View>
    )
  }
}
