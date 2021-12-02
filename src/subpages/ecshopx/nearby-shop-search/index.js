import Taro, { useState, useEffect, useCallback } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { SpNavBar, SpNewInput, SpNewFilterbar, SpNewShopItem, SpNewFilterDrawer } from '@/components'
import { classNames, isNavbar } from '@/utils';
import { FILTER_DATA, FILTER_DRAWER_DATA, SEARCH_DATA } from '../consts/index';
import './index.scss';

const NavbarTitle = '搜索';

// const { navbarHeight }=getNavbarHeight();

//微信小程序顶部距离=导航栏距离+输入框距离+筛选tab距离
// const top=`${pxTransform(navbarHeight)+ 92 + 92}rpx`;

const NearbyShopSearch = (props) => {

    const [filterData] = useState(FILTER_DATA);

    const [filterValue, setFilterValue] = useState(FILTER_DATA[0]);

    const [filterVisible, setFilterVisible] = useState(false);

    //是否搜索
    const [searchAction, setSearchAction] = useState(true);

    //点击搜索框搜索
    const handleConfirm = useCallback(
        () => {
            setSearchAction(true)
        },
        [],
    );

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

    useEffect(() => {

    }, []);

    return (
        <View className={classNames(
            'sp-page-nearbyshopsearch',
            {
                'has-navbar': isNavbar()
            }
        )}>

            <SpNavBar
                title={NavbarTitle}
                leftIconType='chevron-left'
                fixed='true'
            />

            <View className={'sp-page-nearbyshopsearch-input'}>
                <SpNewInput
                    onConfirm={handleConfirm}
                />
            </View>

            {
                !searchAction ?
                    <View className={'sp-page-nearbyshopsearch-search'}>
                        <View className={'sp-page-nearbyshopsearch-search-title'}>
                            <View className={'left'}>最近搜索</View>
                            <View className={'right'}>清除搜索历史</View>
                        </View>
                        <View className={'sp-page-nearbyshopsearch-search-content'}>
                            {
                                SEARCH_DATA.map((item, index) => {
                                    return <View className={classNames('sp-filter-block', { 'checked': index === 1 })}>
                                        {item}
                                    </View>
                                })
                            }
                        </View>
                    </View> :
                    <View className={'sp-page-nearbyshopsearch-list'}>
                        <SpNewFilterbar
                            bgWhite={false}
                            borderRadius={true}
                            filterData={filterData}
                            value={filterValue.value}
                            onClickLabel={handleClickFilterLabel}
                            onClickFilter={handleClickFilter}
                        />

                        <ScrollView
                            className={classNames('sp-page-nearbyshopsearch-scrollview')}
                            scrollY
                            scrollWithAnimation 
                        >
                            {
                                new Array(100).fill('1').map((item, index) => (
                                    <SpNewShopItem
                                        inSearch
                                        className={classNames( 
                                            'in-shop-search'
                                        )} 
                                    />
                                ))
                            }
                        </ScrollView>

                        <SpNewFilterDrawer
                            visible={filterVisible}
                            filterData={FILTER_DRAWER_DATA}
                        />
                    </View>
            }



        </View>
    )
}

export default NearbyShopSearch;

NearbyShopSearch.config = {
    // navigationStyle: 'custom'
    navigationBarTitleText: NavbarTitle
}
