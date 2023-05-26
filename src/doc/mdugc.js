import { formatDateTime, thousandthFormat } from '@/utils'

export const UGC_LIST = {
  image_url: 'cover',
  head_portrait: 'userInfo.headimgurl',
  postId: 'post_id',
  title: 'title',
  author: 'userInfo.nickname',
  user_id: 'userInfo.user_id',
  likes: 'likes',
  likeStatus: ({ like_status }) => {
    return like_status === 1
  },
  badges: ({ badges }) => {
    return badges || []
  }
}

export const MDUGC_TOPICLIST = {
  tag_id: 'topic_id',
  tag_name: 'topic_name'
}

export const UGC_DETAIL = {
  imgList: 'images',
  followStatus: 'follow_status',
  title: 'title',
  content: 'content',
  topics: 'topics',
  goods: ({ goods }) => {
    return goods ? goods.map(item => {
      return {
        ...item,
        imgUrl: item.pics[0],
        ImgTitle: item.item_name
      }
    }) : []
  },
  likes: 'likes',
  favoriteNums: 'favorite_nums',
  favoriteStatus: 'favorite_status',
  shareNums: 'share_nums',
  created: ({ created }) => {
    return formatDateTime(created, 'YYYY-MM-DD')
  }
}

export const GOOD_INFO = {
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
  price: ({ price }) => (price / 100).toFixed(2),
  member_price: ({ member_price }) => (member_price / 100).toFixed(2),
  market_price: ({ market_price }) => (market_price / 100).toFixed(2)
}

export const MAKE_COLLECTION_LIST = {
  postInfo: "postInfo",
  item_id: "article_id",
  title: "title",
  from_userInfo: 'from_userInfo',
  content: 'content',
  time: 'created_moment',
  from_nickname: 'from_nickname',
  post_id: 'post_id'
}

export const MAKE_COMPLETE_LIST = {
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
  price: ({ price }) => (price / 100).toFixed(2),
  member_price: ({ member_price }) => (member_price / 100).toFixed(2),
  market_price: ({ market_price }) => (market_price / 100).toFixed(2)
}

