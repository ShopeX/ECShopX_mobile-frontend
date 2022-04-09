import Taro from '@tarojs/taro'
import { useEffect, useRef, useState, useCallback } from 'react'
import { pickBy } from '@/utils'
import { useDepChange } from '@/hooks'
import api from '@/api'

//解决闭包问题
export function useLatest(params) {
  const latest = useRef()

  useEffect(() => {
    latest.current = params
  })

  return latest
}

const useTimer = (seconds = 60) => {
  const [time, setTime] = useState(null)

  const latestTime = useLatest(time)

  const startTime = useCallback(() => {
    setTime(seconds)
    const id = setInterval(() => {
      setTime(latestTime.current - 1)
      if (latestTime.current === 1) {
        setTime(null)
        clearInterval(id)
      }
    }, 1000)
  }, [])

  return [time, startTime]
}

//模拟setState的回调函数
export function useStateCallback(initialValue, next) {
  const asyncCallback = useRef()

  const [state, setState] = useState(initialValue)

  const setStateCallback = (nextValue, fn) => {
    setState(nextValue)
    asyncCallback.current = fn
  }

  useDepChange(() => {
    asyncCallback.current && asyncCallback.current(state)
  }, [state])

  return [state, setStateCallback]
}

//强制刷新界面
export function useUpdate() {
  const [, forceUpdate] = useState()

  return useCallback(() => forceUpdate({}), [])
}

//获取区域等操作
export function useArea() {
  //总区域
  const [allAreaList, setAllAreaList] = useState([])
  //选择器区域
  const [areaList, setAreaList] = useState([])
  //选择下标
  const [multiIndex, setMultiIndex] = useStateCallback([0, 0, 0])
  //选择省市区
  const [selectArea, setSelectArea] = useState([])

  const getAllAreaList = async () => {
    let res = await api.member.areaList()
    const nList = pickBy(res, {
      label: 'label',
      children: 'children',
      value: 'value'
    })
    setAllAreaList(nList)
  }

  const setArea = () => {
    let arrProvince = []
    let arrCity = []
    let arrCounty = []
    allAreaList.forEach((item, index) => {
      arrProvince.push(item.label)
      if (index === 0) {
        item.children.forEach((c_item, c_index) => {
          arrCity.push(c_item.label)
          if (c_index === 0) {
            c_item.children.forEach((cny_item) => {
              arrCounty.push(cny_item.label)
            })
          }
        })
      }
    })
    setAreaList([arrProvince, arrCity, arrCounty])
  }

  useDepChange(() => {
    setArea()
  }, [allAreaList])

  useEffect(() => {
    getAllAreaList()
  }, [])

  const onColumnChange = (e) => {
    console.log('===onColumnChange==', e)
    let selectColumn = e.detail.column
    let selectIndex = e.detail.value

    if (selectColumn === 0) {
      setMultiIndex([selectIndex, 0, 0])

      allAreaList.forEach((item, index) => {
        if (index === selectIndex) {
          let arrCity = []
          let arrCounty = []
          item.children.forEach((c_item, c_index) => {
            arrCity.push(c_item.label)
            if (c_index === 0) {
              c_item.children.forEach((cny_item) => {
                arrCounty.push(cny_item.label)
              })
            }
          })
          areaList[1] = arrCity
          areaList[2] = arrCounty
          setAreaList([...areaList])
        }
      })
    } else if (selectColumn === 1) {
      multiIndex[1] = selectIndex
      multiIndex[2] = 0
      setMultiIndex([...multiIndex], (newMultiIndex) => {
        allAreaList[newMultiIndex[0]].children.forEach((c_item, c_index) => {
          if (c_index === selectIndex) {
            let arrCounty = []
            c_item.children.map((cny_item) => {
              arrCounty.push(cny_item.label)
            })
            areaList[2] = arrCounty
            setAreaList([...areaList])
          }
        })
      })
    } else {
      multiIndex[2] = selectIndex
      setMultiIndex(multiIndex)
    }
  }

  const onChange = (e) => {
    const selectValue = e.detail.value
    let selectArea = []
    allAreaList.forEach((item, index) => {
      if (index === selectValue[0]) {
        selectArea[0] = item
        item.children.forEach((s_item, sIndex) => {
          if (sIndex === selectValue[1]) {
            selectArea[1] = s_item
            s_item.children.forEach((th_item, thIndex) => {
              if (thIndex === selectValue[2]) {
                selectArea[2] = th_item
              }
            })
          }
        })
      }
    })
    setSelectArea(selectArea)
  }

  return {
    areaList,
    onColumnChange,
    onChange,
    selectArea
  }
}

function usePrevious(state, compare = true) {
  const previous = useRef()

  useEffect(() => {
    const needUpdate = typeof compare === 'function' ? compare(previous.current, state) : compare

    if (needUpdate) {
      previous.current = state
    }
  })

  return previous.current
}

export { useTimer, usePrevious }
