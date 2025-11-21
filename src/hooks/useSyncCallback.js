/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { useEffect, useState, useCallback } from 'react'

const useSyncCallback = (callback) => {
  const [proxyState, setProxyState] = useState({ current: false })

  const Func = useCallback(() => {
    setProxyState({ current: true })
  }, [proxyState])

  useEffect(() => {
    if (proxyState.current === true) {
      setProxyState({ current: false })
    }
  }, [proxyState])

  useEffect(() => {
    proxyState.current && callback()
  })

  return Func
}

export default useSyncCallback
