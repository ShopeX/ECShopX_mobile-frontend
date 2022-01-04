import { total } from '@/api/cart'
import { useState, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'

const initialState = {
  loading: false,
  hasMore: true,
  pageIndex: 1,
  pageSize: 10
}

export default (props) => {
  const { fetch, auto = true } = props
  const [page, setPage] = useImmer(initialState)
  const totalRef = useRef(0)

  const [hasNext, setHasNext] = useState(true)

  useEffect(() => {
    if (auto) {
      excluteFetch()
    }
  }, [page.pageIndex])

  const excluteFetch = async () => {
    setPage((v) => {
      v.loading = true
    })
    const { total } = await fetch(page)
    totalRef.current = total
    setPage((v) => {
      if (!total || total <= page.pageSize * page.pageNo) {
        v.hasMore = false
      }
      v.loading = false
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
  const resetPage = async () => {
    totalRef.current = 0
    await setPage((v) => {
      v.pageIndex = 1
      v.hasMore = true
    })
    if (!auto || page.pageIndex == 1) {
      excluteFetch()
    }
  }

  return {
    page,
    getTotal,
    nextPage,
    resetPage
  }
}
