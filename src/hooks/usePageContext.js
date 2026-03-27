/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createContext, useContext } from 'react'

const context = createContext(null)

/** 获取页面上下文，包含 scrollTop 等（由 SpPage 提供） */
export function usePageContext() {
  const value = useContext(context)
  return value || {}
}

export default context
