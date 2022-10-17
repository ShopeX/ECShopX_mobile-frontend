import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useImmer } from "use-immer"
import Taro, { getCurrentInstance } from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import { changeZitiAddress } from '@/store/slices/cart'
import { SpPage, SpCheckboxNew } from '@/components'
import "./ziti-picker.scss";

const initialState = {
  zitiList: [],
  zitiId: null
}
function StoreZitiPicker(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { zitiList, zitiId } = state
  const dispatch = useDispatch()
  useEffect(() => {
    fetchZitiList()
  }, [])

  const fetchZitiList = async () => {
    const { distributor_id, zitiId } = $instance.router.params
    const { list } = await api.cart.getZitiList({
      cart_type: 'cart',
      distributor_id
    })
    setState(draft => {
      draft.zitiList = list,
      draft.zitiId = zitiId
    })
  }

  const onChangeSelectZiti = (item, e) => {
    dispatch(changeZitiAddress(item))

    setTimeout(() => {
      Taro.navigateBack()
    }, 300)
  }

  return <SpPage className='page-store-zitipicker'>
    {
      zitiList.map((item, index) => (
        <View className='ziti-item' key={`ziti-item__${index}`}>
          <View className='ziti-item-bd'>
            <View className='name'>{item.name}</View>
            <View className='address'>{`${item.province}${item.city}${item.area}${item.address}`}</View>
          </View>
          <SpCheckboxNew onChange={onChangeSelectZiti.bind(this, item)} checked={zitiId == item.id} />
        </View>
      ))
    }
  </SpPage>;
}

StoreZitiPicker.options = {
  addGlobalClass: true
}

export default StoreZitiPicker
