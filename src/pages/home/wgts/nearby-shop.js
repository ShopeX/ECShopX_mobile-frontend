import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { memo, useState, useEffect,useDidShow,useRef } from '@tarojs/taro'
import api from '@/api'
import entryLaunchFun from '@/utils/entryLaunch'
import { SpNoShop, CusNoPosition } from '@/components'
import { getThemeStyle, styleNames } from '@/utils'
import './nearby-shop.scss'

const WgtNearbyShop = (props) => {
    // 只会返回时执行一次 
    useDidShow(()=>{
        init();
    },[])

    const { info = null, refreshHeaderHome } = props
    if (!info) return
    const { base, seletedTags } = info

    const [activeIndex, setActiveIndex] = useState(0);
    const [nearbyShop, setNearbyShop] = useState([])
    const [isLocal, setIsLocal] = useState(false);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
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
            show_discount: 1,
            sort_type:1
        }
        const result = await api.wgts.getNearbyShop(obj);
        setNearbyShop(result.list)
        setScrollLeft(0+Math.random()) //在小程序端必须这么写才能回到初始值
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
        await entryLaunchFun.isOpenPosition(() => {
            init();
            refreshHeaderHome();
        })
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
                <ScrollView scrollX className='tagList'>
                    {
                        seletedTags.map((item, index) => (
                            <Text className={`tag ${activeIndex == index ? 'active' : null}`}
                                key={item.tag_id} onClick={e => setActiveIndex(index)}>{item.tag_name}</Text>
                        ))
                    }
                </ScrollView>
                {
                    isLocal ? <ScrollView scrollX className='shopList' scrollLeft={scrollLeft}>
                        {
                            nearbyShop.length > 0 ? nearbyShop.slice(0,10).map((item) => (
                                (
                                    <View className='shop' key={item.distributor_id} onClick={e => handleStoreClick(item.distributor_id)}>
                                        <View className='shopbg'>
                                            <Image mode='scaleToFill' className='shop_img'
                                                src={item.banner || `${process.env.APP_IMAGE_CDN}/shop_default_bg.png`}></Image>

                                            <Image mode='scaleToFill' className='shop_logo'
                                                src={item.logo || `${process.env.APP_IMAGE_CDN}/shop_default_logo.png`}></Image>

                                        </View>

                                        <View className='shop_name'>{item.name}</View>
                                        {
                                            base.show_coupon ?
                                                item.discountCardList[0] ? <View className='shop_coupon' style={{ border: '1PX solid #f4811f' }} >{item.discountCardList[0].title}</View>
                                                    : <View className='shop_coupon' ></View> : ''
                                        }
                                    </View>
                                )
                            )) : <SpNoShop />
                        }
                    </ScrollView> :
                        <View className='noLocalContent' style={styleNames(getThemeStyle())}>
                            <CusNoPosition onClick={getLocation}>
                            </CusNoPosition>
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
