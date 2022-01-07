import Taro, { useDidShow } from '@tarojs/taro'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { SpImg, SpNote, SpLoading } from '@/components'
import api from '@/api'
import { usePage } from '@/hooks'

import { isObject, classNames, isWeixin, isWeb } from '@/utils'

import './index.scss'

function SpScrollView (props, ref) {
  const { className, children, fetch, auto = true, renderEmpty } = props
  // const scope = useScope();
  const { page, getTotal, nextPage, resetPage } = usePage({
    fetch,
    auto
  })
  const wrapRef = useRef(null)
  const [loading, setLoading] = useState()
  useEffect(() => {
    let observer = null
    if (isWeixin) {
      observer = Taro.createIntersectionObserver(Taro.getCurrentInstance().page, {
        observeAll: true
      })
      setTimeout(() => {
        observer.relativeToViewport({ bottom: 0 }).observe('.scrollview-bottom', (res) => {
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
      observer.observe(document.querySelector('.scrollview-bottom'))
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

  const observerFn = () => {}

  useImperativeHandle(ref, () => ({
    // reset 就是暴露给父组件的方法
    reset: () => {
      resetPage()
    }
  }))

  return (
    <View className={classNames('sp-scrollview', className)} ref={wrapRef}>
      <View className='sp-scrollview-body'>{children}</View>
      {page.loading && <SpLoading>正在加载...</SpLoading>}
      {!page.hasMore &&
        getTotal() == 0 &&
        (renderEmpty ? renderEmpty : <SpNote icon title='没有查询到数据' />)}
      {!page.loading && !page.hasMore && getTotal() > 0 && (
        <SpNote className='no-more' title='--没有更多数据了--'></SpNote>
      )}
      <View className='scrollview-bottom'></View>
    </View>
  )
}

SpScrollView.options = {
  addGlobalClass: true
}

export default React.forwardRef(SpScrollView)
