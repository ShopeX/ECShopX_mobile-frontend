import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { useMemo, memo, useState, useCallback, useEffect } from "react";
import { classNames, JumpStoreIndex, JumpGoodDetail } from "@/utils";
import { SpImage, SpShopCoupon } from "@/components";
import api from "@/api";
import "./index.scss";


function SpShopItem(props) {
  const { className, info } = props;
  if (!info) {
    return null;
  }

  const { logo, name, distance, cardList } = info;

  return (
    <View className={classNames("sp-shop-item", className)}>
      <View className="shop-item-hd">
        <SpImage className="shop-logo" src={logo} />
      </View>
      <View className="shop-item-bd">
        <View className="item-bd-hd">
          <View className="shop-name">{name}</View>
          <View className="shop-distance">{distance}</View>
        </View>
        <View className="item-bd-sb">
          <View className="score">
            评分：{5} 月销：{100}
          </View>
          <View className="express">达达配送</View>
        </View>
        <View className="item-bd-bd">
          {cardList.map((item, index) => (
            <SpShopCoupon />
          ))}
        </View>
        <View className="item-bd-ac"></View>
      </View>
    </View>
  );

  // return inStore || inOrderList || inOrderDetail ? (
  //   <View className={classNames("sp-shop-item", className)}>
  //     <View className={"sp-component-newshopitem-header"}>
  //       {hasLogo && (
  //         <View className={"left"} onClick={handleClickLogo}>
  //           <Image src={logo} className={"img"}></Image>
  //         </View>
  //       )}
  //       <View className={"center"}>
  //         <View className={"name"} onClick={handleClickName}>
  //           <View className={"text"}>{title}</View>
  //           {canJump && <Text className={"iconfont icon-qianwang-01"}></Text>}
  //         </View>
  //         <View className={"rate"}>{rate}</View>
  //       </View>

  //       {inStore && (
  //         <View className={"right"}>
  //           <View className={"button"}>
  //             {fav ? (
  //               <View onClick={handleFocus(false)}>{"取消关注"}</View>
  //             ) : (
  //               <View className={"text"} onClick={handleFocus(true)}>
  //                 <Text className={"iconfont icon-plus"}></Text>
  //                 <Text>{"关注"}</Text>
  //               </View>
  //             )}
  //           </View>
  //         </View>
  //       )}
  //     </View>
  //   </View>
  // ) : (
  //   <View className={classNames("sp-component-newshopitem", className)}>
  //     <View className={"sp-component-newshopitem-top"}>
  //       {hasLogo && (
  //         <View
  //           className={"sp-component-newshopitem-left"}
  //           onClick={handleClickLogo}
  //         >
  //           <Image src={logo} className={"img"} />
  //         </View>
  //       )}
  //       <View className={"sp-component-newshopitem-right"}>
  //         <View className={"sp-component-newshopitem-right-top"}>
  //           <View className={"lineone"}>
  //             <View className={"title"} onClick={handleClickName}>
  //               {info.store_name}
  //             </View>
  //             <View className={"distance"}>{distance}</View>
  //           </View>
  //           <View className={"linetwo"}>
  //             <View className={"info"}>
  //               {rate}
  //               <Text class="sale">月销：{info.sales_count}</Text>
  //             </View>
  //             <View className={"distribute"}>
  //               {info.is_dada && (
  //                 <DistributionLabel>达达配送</DistributionLabel>
  //               )}
  //             </View>
  //           </View>
  //         </View>
  //         <View className={"sp-component-newshopitem-right-bottom"}>
  //           {discountCardList.length !== 0 && (
  //             <View className={"activity-line-one"}>
  //               <View className={"left"}>
  //                 {discountCardList.map((item) => {
  //                   return (
  //                     <SpNewCoupon
  //                       text={item.title}
  //                       className={"in-new-shop-item"}
  //                       isReceive={false}
  //                     />
  //                   );
  //                 })}
  //               </View>
  //               <View className={"right"}>
  //                 <View className={"right-arrow"} onClick={handleExpand}>
  //                   <Text
  //                     className={classNames("iconfont icon-arrowDown", {
  //                       ["expand"]: expand,
  //                     })}
  //                   ></Text>
  //                 </View>
  //               </View>
  //             </View>
  //           )}
  //           {marketingActivityList.map((item) => (
  //             <View className={"activity-line-two discount"}>
  //               <View className={"left"}>
  //                 <View className={"label"}>
  //                   <Text className={"name"}>{item.promotion_tag}</Text>
  //                   <Text className={"msg"}>{item.marketing_name}</Text>
  //                 </View>
  //               </View>
  //             </View>
  //           ))}
  //         </View>
  //       </View>
  //     </View>
  //     {isShowGoods && (
  //       <View className={"sp-component-newshopitem-good-list"}>
  //         {info.itemList.slice(0, goodCount).map((item) => {
  //           return (
  //             <View
  //               className={"good-item"}
  //               onClick={() =>
  //                 JumpGoodDetail(item.item_id, info.distributor_id)
  //               }
  //             >
  //               <Image className="img" src={item.pics}></Image>
  //               <View className="price">
  //                 <SpNewPrice price={item.price} />
  //                 <View className={"margin"}></View>
  //                 <SpNewPrice
  //                   price={item.market_price}
  //                   discount
  //                   equal
  //                   size={"small"}
  //                 />
  //               </View>
  //             </View>
  //           );
  //         })}
  //       </View>
  //     )}
  //   </View>
  // );
}

SpShopItem.options = {
  addGlobalClass: true,
};

export default memo(SpShopItem);
