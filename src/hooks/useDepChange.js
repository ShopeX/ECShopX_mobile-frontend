import { useRef, useEffect } from 'react'

//在依赖改变时触发
export default (fn = () => {}, dependencies) => {
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) {
      fn()
    }
  }, [...dependencies])

  useEffect(() => {
    mounted.current = true
  }, [])
}
