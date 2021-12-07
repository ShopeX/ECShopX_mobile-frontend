import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { memo, useState, useEffect } from '@tarojs/taro'
import api from '@/api'
import entryLaunchFun from '@/utils/entryLaunch'
import { SpNoShop } from '@/components'
import './nearby-shop.scss'


const WgtNearbyShop = (props) => {

    const { info = null } = props
    if (!info) return
    const { base, seletedTags } = info

    const [activeIndex, setActiveIndex] = useState(0);
    const [nearbyShop, setNearbyShop] = useState([])
    const [isLocal, setIsLocal] = useState(false);

    useEffect(async () => {
        init();
    }, [activeIndex])

    const init = async () => {
        const { latitude, longitude } = Taro.getStorageSync('lnglat')
        if (!latitude && !longitude) {
            return
        } else {
            setIsLocal(true)
        }

        const obj = {
            lat: latitude,
            lng: longitude,
            distributor_tag_id: seletedTags[activeIndex].tag_id,
            show_discount: 1
        }
        const result = await api.wgts.getNearbyShop(obj);
        setNearbyShop(result.list)
    }

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

    const getLocation = async () => {
        await entryLaunchFun.isOpenPosition()
        init();
    }

    Taro.eventCenter.on('lnglat-success', () => {
        console.log(Taro.getStorageSync('lnglat'), 'getStorageSyncgetStorageSync')
    })
    return (
        <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
            {base.title && (
                <View className='wgt__header' style={{ justifyContent: 'space-between' }}>
                    <View className='wgt__title'>{base.title}</View>
                    {
                        isLocal && <View className='wgt__more' style={{ width: 'auto' }}>
                            <View className='see_more' onClick={showMore}>查看更多</View>
                        </View>
                    }

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
                                                src={item.banner || `${process.env.APP_IMAGE_CDN}/shop_default_bg.png`} width={200}></Image>

                                            <Image mode='widthFix' className='shop_logo'
                                                src={item.logo || `${process.env.APP_IMAGE_CDN}/shop_default_logo.png`} width={70}></Image>

                                        </View>

                                        <View className='shop_name'>{item.name}</View>
                                        {
                                            item.discountCardList[0] && <View className='shop_coupon' >{item.discountCardList[0].title}</View>
                                        }



                                    </View>
                                )
                            )) : <SpNoShop />
                        }
                    </View> : <View className='noLocalContent'>
                        <View className='noLocalContent-tips'>未授权位置信息，请授权定位</View>
                        <Button className='noLocalContent-btn' onClick={e => getLocation()} type='primary'>直接授权定位</Button>
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
