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
