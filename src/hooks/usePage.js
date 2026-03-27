/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'

const initialState = {
  loading: true,
  hasMore: true,
  pageIndex: 1,
  pageSize: 10,
  reset: false
}

function buildPageSnapshot(page) {
  return {
    pageIndex: page.pageIndex,
    pageSize: page.pageSize,
    loading: page.loading,
    hasMore: page.hasMore,
    reset: page.reset
  }
}

export default (props) => {
  const { fetch, auto = true, pageSize = 10 } = props
  const [page, setPage] = useImmer({
    ...initialState,
    pageSize
  })
  const totalRef = useRef(0)
  const pageRef = useRef(page)
  pageRef.current = page

  async function excluteFetch() {
    const snapshot = buildPageSnapshot(pageRef.current)
    setPage((v) => {
      v.loading = true
    })
    try {
      const res = await fetch(snapshot)
      const total = res != null && res.total != null ? Number(res.total) : 0
      totalRef.current = total
      setPage((v) => {
        if (!total || total <= snapshot.pageSize * snapshot.pageIndex) {
          v.hasMore = false
        } else {
          v.hasMore = true
        }
        v.loading = false
        v.reset = false
      })
    } catch (e) {
      console.error('usePage fetch:', e)
      setPage((v) => {
        v.loading = false
        v.reset = false
      })
    }
  }

  useEffect(() => {
    if (auto || page.pageIndex > 1) {
      excluteFetch()
    }
  }, [page.pageIndex])

  useEffect(() => {
    if (page.reset) {
      excluteFetch()
    }
  }, [page.reset])

  const nextPage = () => {
    const { pageIndex, pageSize: size } = pageRef.current
    const curPage = pageIndex + 1
    if (!totalRef.current || curPage > Math.ceil(+totalRef.current / size)) {
      setPage((v) => {
        v.hasMore = false
      })
      return
    }
    setPage((v) => {
      v.pageIndex = curPage
    })
  }

  const getTotal = () => {
    return totalRef.current
  }

  /**
   * @function 分页重置
   */
  const resetPage = () => {
    totalRef.current = 0
    setPage((draft) => {
      draft.pageIndex = 1
      draft.hasMore = true
      draft.reset = true
    })
  }

  return {
    page,
    getTotal,
    nextPage,
    resetPage
  }
}
