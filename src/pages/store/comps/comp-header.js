import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import './comp-header.scss'
import { classNames } from "@/utils";
import { useState,useCallback } from 'react'
import api from "@/api";
import { SpShopCoupon,SpShopFullReduction } from '@/components'
import { useLogin } from '@/hooks'

function CompHeader(props){
    const { info, couponList = [], fullReduction = [{promotion_tag:"满减",marketing_name:"好物狂欢节享满199减30"},{promotion_tag:"满减",marketing_name:"好物狂欢节享满199减30"}] } = props
    const { brand = '', name = '', scoreList = {}} = info
    const [showMore, setShowMore] = useState(false)
    const [fav, setFav] = useState(false)
    const { isLogin } = useLogin({
        autoLogin: false
    })
    const handleCouponClick = useCallback(() => {
        Taro.navigateTo({
          url: `/others/pages/home/coupon-home?distributor_id=${info.distributor_id}`,
        });
    }, [info]);
    const handleFocus = (flag) => async () => {
        if(!isLogin) {
            return Taro.showToast({
                icon: "none",
                title: '请先授权',
            });
        }
        let data = {};
        if (flag) {
            //关注
          data = await api.member.storeFav(info.distributor_id);
        } else {
            //取消
          data = await api.member.storeFavDel(info.distributor_id);
        }
        if (Object.keys(data).length > 0) {
          Taro.showToast({
            icon: "none",
            title: flag ? "关注成功" : "取消关注成功",
          });
        }
        setFav(flag);
      };
    //品牌介绍
    const brandInfo = () => {}
    console.log('couponList==',couponList)
    return (
        <View className="comp-header">
            {/* {店铺信息} */}
            <View className="header-top">
                <Image src={brand} className="header-img"/>
                <View className="top-middle">
                    <View className='store-name'>{name}</View>
                    <View className='store-avgSstar-block'>
                        <Text className='store-avgSstar'>评分:{scoreList.avg_star}</Text>
                        <View className='brand-produce' onClick={brandInfo}>品牌介绍 ></View>
                    </View>
                </View>
                <View className='attention' onClick={handleFocus(!fav)}>
                    {fav ? '取消关注' : '+关注'}
                </View>
            </View>
            {/* {优惠券} */}
            {
                couponList.length>0 && <View className='coupon-block' onClick={handleCouponClick}>
                <Text className="get-coupon">领券</Text>
                {
                    couponList.slice(0,3).map((item,index) => (
                        <SpShopCoupon info={item} key={`shop-coupon__${index}`} fromStoreIndex className='coupon-index'/>
                    ))
                }
                </View>
            }
            {/* {满减} */}
            {
                fullReduction.length>0 && <View className={!showMore ? 'full-block' : 'full-block pick'} >
                {
                    fullReduction.map((item,index) => (
                        <SpShopFullReduction 
                          info={item} 
                          key={`shop-full-reduction__${index}`} 
                          showMoreIcon={fullReduction.length > 1 && index == 0 }
                          status={showMore}
                          count={fullReduction.length}
                          handeChange={(e) => setShowMore(e)}
                        />
                    ))
                }
                </View>
            }
        </View>
    )
}
CompHeader.options = {
    addGlobalClass: true,
};

export default CompHeader