export const MDUGC_NLIST = {
  image_url: 'cover',
  head_portrait: 'userInfo.headimgurl',
  item_id: 'post_id',
  title: 'title',
  author: 'userInfo.nickname',
  user_id: 'userInfo.user_id',
  likes: 'likes',
  isheart: 'like_status',
  badges: 'badges'
}


export const MDUGC_TOPICLIST = {
  topic_id: 'topic_id',
  topic_name: 'topic_name'
}

export const GOOD_INFO =  {
  img: ({ pics }) => pics ? typeof pics !== 'string' ? pics[0] : JSON.parse(pics)[0] : '',
  item_id: 'item_id',
  title: ({ itemName, item_name }) => itemName ? itemName : item_name,
  desc: 'brief',
  distributor_id: 'distributor_id',
  distributor_info: 'distributor_info',
  promotion_activity_tag: 'promotion_activity',
  origincountry_name: 'origincountry_name',
  origincountry_img_url: 'origincountry_img_url',
  type: 'type',
  price: ({ price }) => (price/100).toFixed(2),
  member_price: ({ member_price }) => (member_price/100).toFixed(2),
  market_price: ({ market_price }) => (market_price/100).toFixed(2)
}


export const MAKE_COLLECTION_LIST  = {
    postInfo:"postInfo",
    item_id:"article_id",
    title:"title",
    from_userInfo:'from_userInfo',
    content:'content',
    time:'created_moment',
    from_nickname:'from_nickname',
    post_id:'post_id'
  }

  export const MAKE_COMPLETE_LIST  = {
    img: ({ pics }) => pics ? typeof pics !== 'string' ? pics[0] : JSON.parse(pics)[0] : '',
    item_id: 'item_id',
    title: ({ itemName, item_name }) => itemName ? itemName : item_name,
    desc: 'brief',
    distributor_id: 'distributor_id',
    distributor_info: 'distributor_info',
    promotion_activity_tag: 'promotion_activity',
    origincountry_name: 'origincountry_name',
    origincountry_img_url: 'origincountry_img_url',
    type: 'type',
    price: ({ price }) => (price/100).toFixed(2),
    member_price: ({ member_price }) => (member_price/100).toFixed(2),
    market_price: ({ market_price }) => (market_price/100).toFixed(2)
  }

