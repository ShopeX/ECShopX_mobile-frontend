import { View, Text, Image } from '@tarojs/components'
import Taro, { memo, useState, useEffect } from '@tarojs/taro'
import api from '@/api'
import './nearby-shop.scss'

const noShop = require('@/assets/imgs/noShop.png');
const shop_default_bg = require('@/assets/imgs/shop_default_bg.png');
const shop_default_logo = require('@/assets/imgs/shop_default_logo.png');



const WgtNearbyShop = (props) => {

    const { info = null } = props
    if (!info) return
    const { base, seletedTags } = info

    const [activeIndex, setActiveIndex] = useState(0);
    const [nearbyShop, setNearbyShop] = useState([])
    const [isLocal,   setIsLocal] = useState(false);

    useEffect(async () => {

        if (!isLocal) {
            return;
        }

        const { latitude, longitude } = Taro.getStorageSync('lnglat')
        const obj = {
            lat: latitude,
            lng: longitude,
            distributor_tag_id: seletedTags[activeIndex].tag_id,
            show_discount: 1
        }
        const result = await api.wgts.getNearbyShop(obj);
        setNearbyShop(result.list)
    }, [activeIndex])

    const showMore = () => {
        Taro.navigateTo({
            url: '/subpages/ecshopx/nearby-shop-list/index'
        })
    }

    const handleStoreClick = (id) => {
        const url = `/pages/store/index?id=${id}`
        Taro.navigateTo({
            url
        })
    }

    return (
        <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
            {base.title && (
                <View className='wgt__header' style={{ justifyContent: 'space-between' }}>
                    <View className='wgt__title'>{base.title}</View>
                    <View className='wgt__more' style={{ width: 'auto' }}>
                        <View className='see_more' onClick={showMore}>查看更多</View>
                    </View>
                </View>
            )}

            <View className='nearby_shop_wrap'>
                <View className='tagList'>
                    {
                        seletedTags.map((item, index) => (
                            <Text className={`tag ${activeIndex == index ? 'active' : null}`}
                                key={item.tag_id} onClick={e => setActiveIndex(index)}>{item.tag_name}</Text>
                        ))
                    }
                </View>
                {
                    isLocal ? <View className='shopList'>
                        {
                            nearbyShop.length > 0 ? nearbyShop.map((item) => (
                                (
                                    <View className='shop' key={item.distributor_id} onClick={e => handleStoreClick(item.distributor_id)}>
                                        <View className='shopbg'>
                                            <Image mode='widthFix' className='shop_img'
                                                src={item.banner || shop_default_bg} width={200}></Image>

                                            <Image mode='widthFix' className='shop_logo'
                                                src={item.logo || shop_default_logo} width={70}></Image>
                                        </View>

                                        <View className='shop_name'>{item.name}</View>
                                        {
                                            item.discountCardList[0] && <View className='shop_coupon' >{item.discountCardList[0].title}</View>
                                        }



                                    </View>
                                )
                            )) : <View className='noShopContent'>
                                <Image mode='widthFix' className='noShop' src={noShop}></Image>
                                <View className='tips'>更多商家接入中，敬请期待</View>
                            </View>
                        }
                    </View>:<View className='noLocalContent'>
                        <View className='noLocalContent-tips'>未授权位置信息，请授权定位</View>
                        <Button className='noLocalContent-btn' type='primary'>直接授权定位</Button>
                    </View>
                }


            </View>
        </View>
    )
}

WgtNearbyShop.options = {
    addGlobalClass: true
}
export default memo(WgtNearbyShop)
