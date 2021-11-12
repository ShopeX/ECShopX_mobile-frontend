import { useState, useEffect } from '@tarojs/taro'

export default (props) => {
  const { fetch } = props
  const [page, setPage] = useState({
    pageIndex: 1,
    pageSize: 10
  })
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasNext, setHasNext] = useState(true)

  useEffect(async () => {
    setLoading(true)
    await fetch(page)
    setLoading(false)
  }, [page])

  const nextPage = () => {
    const curPage = page.pageIndex + 1
    if (!total || curPage > Math.ceil(+total / page.pageSize)) {
      setHasNext(false)
      return
    }
    setPage({
      ...page,
      pageIndex: curPage
    })
  }

  /**
   * @function 分页重置
   */
  const resetPage = () => {
    setPage({
      ...page,
      pageIndex: 1
    })
    setTotal(0)
    setLoading(false)
    setHasNext(true)
  }

  return {
    total,
    loading,
    hasNext,
    setTotal,
    nextPage,
    resetPage
  }
}
