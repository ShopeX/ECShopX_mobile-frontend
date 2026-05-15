/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { withTranslation } from 'react-i18next'
import { $t } from '@/i18n'
import { View, ScrollView } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, SpNote } from '@/components'
import api from '@/api'
import { pickBy } from '@/utils'
import PackageItem from './comps/package-item'
import './package-list.scss'

@withPager
@withBackToTop
class PackageList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      currentPackage: 0,
      list: []
    }
  }

  componentDidMount() {
    this.syncNavTitle()
    this.nextPage()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.i18n?.language !== this.props.i18n?.language) {
      this.syncNavTitle()
    }
  }

  syncNavTitle = () => {
    Taro.setNavigationBarTitle({ title: $t('0194b793.02764f') })
  }

  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const { id } = this.$router?.params
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
    const { distributor_id } = this.$router?.params
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
            {page.isLoading ? <Loading>{$t('0194b793.bd0271')}</Loading> : null}
            {!page.isLoading && !page.hasNext && !list.length && (
              <SpNote img='trades_empty.png'>{$t('0194b793.1ecf4a')}</SpNote>
            )}
          </View>
        </ScrollView>

        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop} />
      </View>
    )
  }
}

export default withTranslation()(PackageList)
