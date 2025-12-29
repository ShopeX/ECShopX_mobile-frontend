/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { useEffect } from 'react'

/**
 * 用于在useEffect中支持异步函数的hook
 * @param {Function} effect 异步函数
 * @param {Array} deps 依赖数组
 */
export default function useEffectAsync(effect, deps) {
  useEffect(() => {
    let isMounted = true
    const promise = effect()
    // effect返回Promise时可选处理
    if (promise && typeof promise.then === 'function') {
      promise.catch((err) => {
        // 可以在这里统一处理错误
        // console.error('useEffectAsync error:', err)
      })
    }
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
