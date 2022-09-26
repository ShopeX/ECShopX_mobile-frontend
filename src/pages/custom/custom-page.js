import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import qs from 'qs'
import { View } from '@tarojs/components'
import { SpPage, SpSearch } from '@/components'
import { getDistributorId, log, entryLaunch } from '@/utils'
import { platformTemplateName, transformPlatformUrl } from '@/utils/platform'
import req from '@/api/req'
import HomeWgts from '@/pages/home/comps/home-wgts'
import './custom-page.scss'

const initialState = {
  wgts: [],
  loading: true,
  shareInfo: null
}
function CustomPage(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { wgts, loading, shareInfo } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { id } = await entryLaunch.getRouteParams($instance.router.params)
    const pathparams = qs.stringify({
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: `custom_${id}`,
      distributor_id: getDistributorId()
    })
    const url = transformPlatformUrl(`/pageparams/setting?${pathparams}`)
    const { config, share } = await req.get(url)
    setState((draft) => {
      draft.wgts = config
      draft.loading = false
      draft.shareInfo = share
    })
    // this.setState(
    //   {
    //     positionStatus: (fixSetting.length && fixSetting[0].params.config.fixTop) || false
    //   },
    //   () => {
    //     this.fetchInfo()
    //   }
    // )
  }

  useShareAppMessage(async (res) => {
    return getAppShareInfo()
  })

  useShareTimeline(async (res) => {
    return getAppShareInfo()
  })

  const getAppShareInfo = () => {
    const { id } = $instance.router.params
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `?uid=${userId}&id=${id}` : `?id=${id}`
    const path = `/pages/custom/custom-page${query}`
    log.debug(`getAppShareInfo: ${path}`)
    return {
      title: shareInfo.page_share_title,
      imageUrl: shareInfo.page_share_imageUrl,
      path
    }
  }

  const searchComp = wgts.find((wgt) => wgt.name == 'search')
  let filterWgts = []
  if (searchComp && searchComp.config.fixTop) {
    filterWgts = wgts.filter((wgt) => wgt.name !== 'search')
  } else {
    filterWgts = wgts
  }
  const fixedTop = searchComp && searchComp.config.fixTop

  return (
    <SpPage className='page-custom-page' loading={loading}>
      {fixedTop && <SpSearch isFixTop={searchComp.config.fixTop} />}
      <HomeWgts wgts={filterWgts} />
    </SpPage>
  )
}

CustomPage.options = {
  addGlobalClass: true
}

export default CustomPage
