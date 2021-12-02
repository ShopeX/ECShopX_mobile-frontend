import Taro, { useState, useEffect, useCallback } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { SpNavBar, SpNewInput, SpNewFilterbar, SpNewShopItem, SpNewFilterDrawer } from '@/components'
import { classNames,isNavbar } from '@/utils';
import { FILTER_DATA, FILTER_DRAWER_DATA } from '../consts/index';
import './index.scss';

const NavbarTitle='附近商家';

// const { navbarHeight }=getNavbarHeight();

//微信小程序顶部距离=导航栏距离+输入框距离+筛选tab距离
// const top=`${pxTransform(navbarHeight)+ 92 + 92}rpx`;

const NearbyShopList = (props) => {

    const [filterData] = useState(FILTER_DATA);

    const [filterValue, setFilterValue] = useState(FILTER_DATA[0]);

    const [filterVisible, setFilterVisible] = useState(false);

    const handleClickFilterLabel = useCallback(
        (item) => {
            setFilterValue(item);
        },
        [],
    );

    const handleClickFilter = useCallback(
        () => {
            setFilterVisible(true)
        },
        [],
    );

    const handleClickInput = useCallback(
        () => {
            Taro.navigateTo({
                url:'/subpages/ecshopx/nearby-shop-search/index'
            })
        },
        []
    );

    useEffect(() => {

    }, []);

    return (
        <View className={classNames(
            'sp-page-nearbyshoplist',
            {
                'has-navbar':isNavbar()
            }
        )}>

            <SpNavBar
                title={NavbarTitle}
                leftIconType='chevron-left'
                fixed='true'
            />

            <View className={'sp-page-nearbyshoplist-input'}>
                <SpNewInput 
                    isStatic
                    onClick={handleClickInput}
                />
            </View>

            <SpNewFilterbar
                filterData={filterData}
                value={filterValue.value}
                onClickLabel={handleClickFilterLabel}
                onClickFilter={handleClickFilter}
            />

            <ScrollView
                className={classNames('sp-page-nearbyshoplist-scrollview')}
                scrollY
                scrollWithAnimation 
            >
                {
                    new Array(100).fill('1').map((item, index) => (
                        <SpNewShopItem
                            className={classNames(
                                'in-shoplist',
                                { 'in-shoplist-last': index === 99 }
                            )
                            } />
                    ))
                }
            </ScrollView>

            <SpNewFilterDrawer
                visible={filterVisible}
                filterData={FILTER_DRAWER_DATA}
            />

        </View>
    )
}

export default NearbyShopList;

NearbyShopList.config = {
    // navigationStyle: 'custom'
    navigationBarTitleText:NavbarTitle
}
