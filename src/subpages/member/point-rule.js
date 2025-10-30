// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, ScrollView, RichText } from '@tarojs/components'
import { SpPage } from '@/components'
import { isWeb, isAlipay, htmlStringToNodeArray } from '@/utils'
import './point-rule.scss'

const initialState = {
  content: ''
}
function PointRule(props) {
  const [state, setState] = useImmer(initialState)
  const { content } = state

  useEffect(() => {
    fetchPointRules()
  }, [])

  const fetchPointRules = async () => {
    const { rule_desc } = await api.pointitem.getPointSetting()
    setState((draft) => {
      draft.content = rule_desc
    })
  }

  let _content = content
    .replace(/\s+style="[^"]*"/g, '')
    .replace(/<img/g, '<img style="width:100%;height:auto;display: block;"')

  if (isAlipay) {
    _content = htmlStringToNodeArray(_content)
  }
  console.log('content:', _content)
  return (
    <SpPage className='page-point-rule'>
      <ScrollView className='point-scroll-view' scrollY>
        {isWeb && <View dangerouslySetInnerHTML={{ __html: _content }} />}
        {!isWeb && !isAlipay && <mp-html content={_content} />}
        {isAlipay && <RichText nodes={_content} />}
      </ScrollView>
    </SpPage>
  )
}

PointRule.options = {
  addGlobalClass: true
}

export default PointRule
