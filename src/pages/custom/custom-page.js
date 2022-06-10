import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import qs from 'qs'
import { View } from '@tarojs/components'
import { SpPage, SpSearch } from '@/components'
import { getDistributorId } from '@/utils'
import { platformTemplateName, transformPlatformUrl } from '@/utils/platform'
import req from '@/api/req'
import HomeWgts from '@/pages/home/comps/home-wgts'
import './custom-page.scss'

const initialState = {
  wgts: [],
  loading: true
}
function CustomPage(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { wgts, loading } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    const { id } = $instance.router.params
    const pathparams = qs.stringify({
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: `custom_${id}`,
      distributor_id: getDistributorId()
    })
    const url = transformPlatformUrl(`/pageparams/setting?${pathparams}`)
    const { config } = await req.get(url)
    setState((draft) => {
      draft.wgts = config
      draft.loading = false
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
    const { shareInfo } = this.state
    const { id } = this.$instance.router.params
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `?uid=${userId}&id=${id}` : `?id=${id}`

    return {
      title: shareInfo.page_share_title,
      imageUrl: shareInfo.page_share_imageUrl,
      path: `/pages/custom/custom-page${query}`
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
