/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { $t } from '@/i18n'

import './license.scss'

export default class HomeLicense extends Component {
  componentDidMount() {}

  render() {
    return (
      <View className='page-home-license'>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.f47e27')}</Text>
          <Text className='dd'>爱茉莉太平洋贸易有限公司</Text>
        </View>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.787be2')}</Text>
          <Text className='dd'>91310000748086078E</Text>
        </View>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.f2f589')}</Text>
          <Text className='dd'>AHN SAE HONG</Text>
        </View>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.7ba697')}</Text>
          <Text className='dd'>上海市嘉定区马陆镇博学南路768号</Text>
        </View>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.2b6eea')}</Text>
          <Text className='dd'>1000.000000万美元</Text>
        </View>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.f19340')}</Text>
          <Text className='dd'>确立</Text>
        </View>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.3a242c')}</Text>
          <Text className='dd'>有限责任公司（台港澳法人独资）</Text>
        </View>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.590847')}</Text>
          <Text className='dd'>2003年03月21日</Text>
        </View>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.c857f2')}</Text>
          <Text className='dd'>2003年03月21日至2033年03月20日</Text>
        </View>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.735d55')}</Text>
          <Text className='dd'>上海市工商局</Text>
        </View>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.95322e')}</Text>
          <Text className='dd'>上海市工商局</Text>
        </View>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.eb5a25')}</Text>
          <Text className='dd'>AMOREPACIFIC GLOBAL OPERATIONS LIMITED</Text>
        </View>
        <View className='dl'>
          <Text className='dt'>{$t('3ac62ef1.04228b')}</Text>
          <Text className='dd'>
            受母公司委托向境内外的关联企业提供投资经营决
            策服务，资金运作和财务管理，研究开发和技术支
            持；物流分拨等物流运作，员工培训与管理；化妆
            品、香水、日用百货、美容用品及器械（医疗美容
            器械除外）、美发用品及器械、电子产品、电器、
            按摩器材、文具、玩具、灯具、家具、厨房用具、
            卫生洁具、纺织品及针织品、服装服饰、鞋帽、箱
            包、工艺礼品（文物除外）、室内装饰品的批发、 零售、佣金代理（拍卖除外），食品流通（除粮
            食）；上述商品的进出囗及相关配套业务（包括：
            仓储、配送、售后服务）；餐饮服务（仅限分支机 构）；美容美体美甲服务（非侵入，仅限分支机
            构）；商务信息咨询。（不涉及国营贸易管理商 品；涉及配额、许可证管理商品的，按照国家有关
            规定办理申请）【依法须经批准的项目，经相关部 门批准后方可开展经营活动】
          </Text>
        </View>
      </View>
    )
  }
}
