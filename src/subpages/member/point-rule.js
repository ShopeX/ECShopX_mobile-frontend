/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
