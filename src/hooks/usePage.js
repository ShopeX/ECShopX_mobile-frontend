import { total } from '@/api/cart'
import { useState, useEffect, useRef } from 'react'
import { useAsyncCallback } from '@/hooks'
import { useImmer } from 'use-immer'

const initialState = {
  loading: false,
  hasMore: true,
  pageIndex: 1,
  pageSize: 10,
  reset: false
}

export default (props) => {
  const { fetch, auto = true, pageSize = 10 } = props
  const [page, setPage] = useImmer({
    ...initialState,
    pageSize
  })
  const totalRef = useRef(0)

  const [hasNext, setHasNext] = useState(true)

  useEffect(() => {
    if (auto || page.pageIndex > 1) {
      excluteFetch()
    }
  }, [page.pageIndex])

  useEffect(() => {
    if(page.reset) {
      excluteFetch()
    }
  }, [page.reset])

  const excluteFetch = async () => {
    setPage((v) => {
      v.loading = true
    })
    const { total } = await fetch(page)
    totalRef.current = total
    // console.log('excluteFetch:', total, page.pageSize, page.pageIndex)
    setPage((v) => {
      if (!total || total <= page.pageSize * page.pageIndex) {
        v.hasMore = false
      }
      v.loading = false
      v.reset = false
    })
  }

  const nextPage = () => {
    const curPage = page.pageIndex + 1
    if (!totalRef.current || curPage > Math.ceil(+totalRef.current / page.pageSize)) {
      setPage((v) => {
        v.hasMore = false
      })
      return
    } else {
      setPage((v) => {
        v.pageIndex = curPage
      })
    }
  }

  const getTotal = () => {
    return totalRef.current
  }

  /**
   * @function 分页重置
   */
  const resetPage = () => {
    console.log('resetPage')
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
