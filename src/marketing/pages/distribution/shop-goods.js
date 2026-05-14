/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Button } from '@tarojs/components'
import { SpToast, Loading, SpNote, SpSearchBar } from '@/components'
import S from '@/spx'
import api from '@/api'
import { withTranslation } from 'react-i18next'
import { withPager, withBackToTop } from '@/hocs'
import { $t } from '@/i18n'
import { classNames, pickBy, getCurrentRoute } from '@/utils'
import { getDtidIdUrl } from '@/utils/helper'
import './shop-goods.scss'

@withPager
@withBackToTop
class DistributionShopGoods extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      query: null,
      list: [],
      goodsIds: [],
      curIdx: ''
    }
  }

  componentDidMount() {
    Taro.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.setState(
      {
        query: {
          item_type: 'normal',
          approve_status: 'onsale,only_show',
          rebate_type: ['total_money', 'total_num'],
          is_promoter: true
        }
      },
      () => {
        this.nextPage()
      }
    )
  }

  async fetch(params) {
    const { userId } = Taro.getStorageSync('userinfo')
    const { page_no: page, page_size: pageSize } = params
    const { selectParams } = this.state
    const query = {
      ...this.state.query,
      page,
      pageSize,
      isSalesmanPage: 1
    }

    const { list, total_count: total } = await api.item.search(query)

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      goods_id: 'goods_id',
      title: 'itemName',
      desc: 'brief',
      rebate_type: 'rebate_type',
      distributor_id: 'distributor_id',
      price: ({ price }) => (price / 100).toFixed(2),
      market_price: ({ market_price }) => (market_price / 100).toFixed(2),
      cost_price: 'cost_price',
      details: null,
      view_detail: false
    })

    let ids = []
    list.map((item) => {
      ids.push(item.goods_id)
    })

    const param = {
      goods_id: ids,
      user_id: userId
    }

    const { goods_id } = await api.distribution.items(param)

    this.setState({
      list: [...this.state.list, ...nList],
      goodsIds: [...this.state.goodsIds, ...goods_id],
      query
    })

    return {
      total
    }
  }

  handleSearchChange = (val) => {
    this.setState({
      query: {
        ...this.state.query,
        keywords: val
      }
    })
  }

  handleConfirm = (val = '') => {
    this.setState(
      {
        query: {
          ...this.state.query,
          keywords: val
        }
      },
      () => {
        this.resetPage()
        this.setState(
          {
            list: []
          },
          () => {
            this.nextPage()
          }
        )
      }
    )
  }

  handleClick = (current) => {
    const cur = this.state.localCurrent

    if (cur !== current) {
      const curTab = this.state.tabList[current]
      const { url } = curTab

      const fullPath = getCurrentRoute(this.$instance?.router).fullPath.split('?')[0]
      if (url && fullPath !== url) {
        Taro.redirectTo({ url })
      }
    }
  }

  handleViewDetail = (idx, id) => {
    const { list } = this.state
    this.setState(
      {
        curIdx: idx
      },
      async () => {
        const query = {
          is_default: false,
          goods_id: id,
          item_type: 'normal',
          pageSize: 50,
          page: 1,
          isSalesmanPage: 1
        }
        const res = await api.item.search(query)
        const details = pickBy(res.list, {
          item_spec: 'item_spec',
          rebate_task_type: ({ rebate_conf }) => rebate_conf.rebate_task_type,
          task: ({ rebate_conf }) => rebate_conf.rebate_task
        })
        console.log(details)
        list[idx].details = details
        list[idx].view_detail = true
        this.setState({
          list
        })
      }
    )
  }

  handleItemRelease = async (id) => {
    const { goodsIds } = this.state
    const goodsId = { goods_id: id }
    const idx = goodsIds.findIndex((item) => id === item)
    const isRelease = idx !== -1
    if (!isRelease) {
      const { status } = await api.distribution.release(goodsId)
      if (status) {
        this.setState(
          {
            goodsIds: [...this.state.goodsIds, id]
          },
          () => {
            S?.toast($t('70a266ab.e241a8'))
          }
        )
      }
    } else {
      const { status } = await api.distribution.unreleased(goodsId)
      if (status) {
        goodsIds.splice(idx, 1)
        this.setState(
          {
            goodsIds
          },
          () => {
            S?.toast($t('70a266ab.0c6d64'))
          }
        )
      }
    }
  }

  onShareAppMessage(res) {
    const { userId } = Taro.getStorageSync('userinfo')
    const { info } = res.target.dataset

    return {
      title: info.title,
      imageUrl: info.img,
      path: getDtidIdUrl(
        `/subpages/item/espier-detail?id=${info.item_id}&uid=${userId}`,
        info.distributor_id
      )
    }
  }

  render() {
    const { list, goodsIds, page, scrollTop, query } = this.state

    return (
      <View className='page-distribution-shop'>
        <View className='searchBar'>
          <SpSearchBar
            showDailog={false}
            keyword={query ? query.keywords : ''}
            onFocus={() => false}
            onCancel={() => {}}
            onChange={this.handleSearchChange}
            onClear={this.handleConfirm.bind(this)}
            onConfirm={this.handleConfirm.bind(this)}
          />
        </View>
        <ScrollView
          className='goods-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='goods-list'>
            {list.map((item, index) => {
              const isRelease = goodsIds.findIndex((n) => item.goods_id == n) !== -1
              return (
                <View className='shop-goods-item' key={item.goods_id}>
                  <View className='shop-goods'>
                    <View className='shop-goods__caption'>
                      <Image className='shop-goods__thumbnail' src={item.img} mode='aspectFill' />
                      <View className='view-flex-item'>
                        <View className='shop-goods__title'>{item.title}</View>
                        <View className='shop-goods__desc'>{item.desc}</View>
                        <View className='shop-goods__price'>
                          <Text className='cur'>¥</Text> {item.price}
                        </View>
                      </View>
                      <View className='shop-goods__task'>
                        <View className='shop-goods__task-label'>{$t('70a266ab.7f9693')}</View>
                        {item.rebate_type === 'total_num' && (
                          <View className='shop-goods__task-type'>{$t('70a266ab.cdce69')}</View>
                        )}
                        {item.rebate_type === 'total_money' && (
                          <View className='shop-goods__task-type'>{$t('70a266ab.d49314')}</View>
                        )}
                      </View>
                    </View>
                    {!item.view_detail ? (
                      <View
                        className='shop-goods__detail'
                        onClick={this.handleViewDetail.bind(this, index, item.goods_id)}
                      >
                        <Text className='icon-search'></Text> {$t('70a266ab.716d9b')}
                      </View>
                    ) : (
                      <View className='shop-goods__detail'>
                        <View className='content-bottom-padded view-flex'>
                          <View className='view-flex-item2'>{$t('70a266ab.ea887b')}</View>
                          <View className='view-flex-item'>{$t('70a266ab.7e6875')}</View>
                          <View className='view-flex-item'>{$t('70a266ab.f41af7')}</View>
                        </View>
                        {item.details &&
                          item.details.map((detail, dindex) => (
                            <View className='shop-goods__detail-item' key={`detail4${dindex}`}>
                              <View className='shop-goods__detail-skus view-flex-item2'>
                                {detail.item_spec ? (
                                  detail.item_spec &&
                                  detail.item_spec.map((sku, sindex) => (
                                    <View className='sku-item' key={`sku${sindex}`}>
                                      {sku.spec_image_url && (
                                        <Image
                                          className='sku-img'
                                          src={sku.spec_image_url}
                                          mode='aspectFill'
                                        />
                                      )}
                                      {sku.spec_custom_value_name || sku.spec_value_name}
                                    </View>
                                  ))
                                ) : (
                                  <Text>{$t('70a266ab.048df4')}</Text>
                                )}
                              </View>
                              {detail.task && (
                                <View className='view-flex-item2'>
                                  {detail.task.map((task, tindex) => (
                                    <View className='view-flex' key={`task${tindex}`}>
                                      <View className='view-flex-item'>{task.filter}</View>
                                      <View className='view-flex-item'>
                                        {task.money && <Text>¥</Text>}
                                        {task.money}
                                      </View>
                                    </View>
                                  ))}
                                </View>
                              )}
                            </View>
                          ))}
                      </View>
                    )}
                  </View>
                  <View className='shop-goods__footer'>
                    <View
                      className={classNames(
                        'shop-goods__footer-item',
                        !isRelease ? 'unreleased' : null
                      )}
                      onClick={this.handleItemRelease.bind(this, item.item_id)}
                    >
                      {isRelease ? (
                        <Text className='icon-moveDown'> {$t('70a266ab.12910e')}</Text>
                      ) : (
                        <Text className='icon-moveUp'> {$t('70a266ab.39177b')}</Text>
                      )}
                    </View>
                    <Button
                      className='shop-goods__footer-item'
                      data-info={item}
                      openType='share'
                      size='small'
                    >
                      <Text className='icon-share2'> {$t('70a266ab.2f8efe')}</Text>
                    </Button>
                  </View>
                </View>
              )
            })}
          </View>
          {page.isLoading ? <Loading>{$t('70a266ab.bd0271')}</Loading> : null}
          {!page.isLoading && !page.hasNext && !list.length && (
            <SpNote img='trades_empty.png'>{$t('70a266ab.ba1de9')}</SpNote>
          )}
        </ScrollView>
        <SpToast />
      </View>
    )
  }
}

export default withTranslation()(DistributionShopGoods)
