/**
 * 首屏渲染结束前为 false，挂载完成后为 true（用于跳过首次 mount 时的 effect）。
 */
import { useEffect, useRef } from 'react'

export default function useFirstMount() {
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
  }, [])
  return mounted.current
}
