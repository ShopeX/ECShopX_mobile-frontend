import { formatTime } from '@/utils'

export const ARTICLE_ITEM = {
  img: 'image_url',
  itemId: 'article_id',
  title: 'title',
  author: 'author',
  summary: 'summary',
  authorIcon: 'head_portrait',
  isPraise: 'isPraise',
  articlePraiseNum: 'articlePraiseNum.count',
  articleFocusNum: 'articleFocusNum.count',
  content: 'content',
  shareImageUrl: 'share_image_url',
  updated: ({ updated }) => formatTime(updated * 1000, 'YYYY-MM-DD')
}
