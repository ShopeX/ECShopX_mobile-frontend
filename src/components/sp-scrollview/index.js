/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Taro, { useDidShow } from '@tarojs/taro'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { SpImg, SpNote, SpLoading } from '@/components'
import api from '@/api'
import { usePage } from '@/hooks'

import { isObject, classNames, isWeixin, isAlipay, isWeb } from '@/utils'
import { useTranslation, $t } from '@/i18n'

import './index.scss'

function SpScrollView(props, ref) {
  useTranslation()
  const {
    className,
    children,
    fetch,
    auto = true,
    renderEmpty,
    style,
    pageSize = 10,
    onLoad = () => {},
    renderMore
  } = props
  // const scope = useScope();
  const { page, getTotal, nextPage, resetPage } = usePage({
    fetch,
    auto,
    pageSize
  })
  const wrapRef = useRef(null)
  const scrollViewRef = useRef(null)
  const [loading, setLoading] = useState()
  const vidRef = useRef(`sv-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`)
  const vid = vidRef.current
  useEffect(() => {
    let observer = null
    if (isWeixin || isAlipay) {
      observer = Taro.createIntersectionObserver(Taro.getCurrentInstance()?.page, {
        observeAll: true
      })
      setTimeout(() => {
        // observer.relativeToViewport({ bottom: 0 }).observe('.scrollview-bottom', (res) => {
        observer.relativeToViewport({ bottom: 0 }).observe(`.scrollview-${vid}`, (res) => {
          if (res.intersectionRatio > 0) {
            if (page.hasMore && !page.loading) {
              nextPage()
            }
          }
        })
      }, 0)
    }

    if (isWeb) {
      observer = new IntersectionObserver(
        (res) => {
          const { isIntersecting } = res[0]
          if (isIntersecting) {
            if (page.hasMore && !page.loading) {
              nextPage()
            }
          }
        },
        {
          // root: document.querySelector(".home-wgts"),
          // threshold: [0, 0.8]
        }
      )
      // observer.observe(document.querySelector('.scrollview-bottom'))
      observer.observe(document.querySelector(`.scrollview-${vid}`))
      // this.observe = observer;
      // observer = new IntersectionObserver((entries, observer) => {
      //   entries.forEach((entry) => {
      //     if (!entry.isIntersecting) {
      //       setLoading(false);
      //       observer.unobserve(entry.target);
      //     }
      //     if (page.hasMore && !page.loading) {
      //       nextPage();
      //     }
      //   });
      // });
      // console.log('wrapRef',wrapRef)
      // // observer.observe(ref.current);
      // observer.observe(wrapRef.current);
    }

    return () => {
      observer.disconnect()
    }
  }, [page])

  useEffect(() => {
    if (!page.hasMore) {
      onLoad()
    }
  }, [page.hasMore])

  const observerFn = () => {}

  useImperativeHandle(ref, () => ({
    // reset 就是暴露给父组件的方法
    reset: () => {
      resetPage()
    }
  }))

  // console.log('sp scrollview:', page.loading, page.hasMore)
  return (
    <View className={classNames('sp-scrollview', className)} style={style} ref={wrapRef}>
      <View className='sp-scrollview-body'>{children}</View>
      {/* 使用固定容器包裹状态提示，保持 DOM 结构稳定，避免滚动位置重置 */}
      <View className='sp-scrollview-footer'>
        {page.hasMore && <SpLoading>{$t('eb9a3a24.bd0271')}</SpLoading>}
        {!page.hasMore &&
          getTotal() == 0 &&
          (renderEmpty ? (
            renderEmpty
          ) : (
            <SpNote img='empty_activity.png' title={$t('eb9a3a24.f1f45e')} />
          ))}
        {!page.loading &&
          !page.hasMore &&
          getTotal() > 0 &&
          (renderMore ? (
            renderMore()
          ) : (
            <SpNote className='no-more' title={$t('eb9a3a24.a25652')}></SpNote>
          ))}
      </View>
      <View className={classNames('scrollview-bottom', `scrollview-${vid}`)}></View>
    </View>
  )
}

SpScrollView.options = {
  addGlobalClass: true
}

export default React.memo(React.forwardRef(SpScrollView))
