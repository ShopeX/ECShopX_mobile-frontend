/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
//plusValue 代表正序 minusValue代表倒序
export const TIME_SORT = 0
export const SALE_PLUS_SORT = 4
export const SALE_MINUS_SORT = 3
export const DISTANCE_PLUS_SORT = 1
export const DISTANCE_MINUS_SORT = 2

export const DEFAULT_SORT_VALUE = DISTANCE_PLUS_SORT

/** 构建排序筛选条数据（配合 $t） */
export function buildFilterData($t) {
  return [
    { value: TIME_SORT, tag_name: $t('20466c3f.ac1a9c') },
    { tag_name: $t('f1d3181c.44e7eb'), plusValue: SALE_PLUS_SORT, minusValue: SALE_MINUS_SORT },
    {
      tag_name: $t('20466c3f.3ec2bb'),
      plusValue: DISTANCE_PLUS_SORT,
      minusValue: DISTANCE_MINUS_SORT
    }
  ]
}

/** 构建抽屉筛选项（配合 $t）；第一项 children 由 fillFilterTag 填充 */
export function buildFilterDrawerData($t) {
  return [
    {
      value: 'tag',
      label: $t('20466c3f.f223b6'),
      children: []
    },
    {
      value: 'logistics',
      label: $t('20466c3f.2b8cb8'),
      children: [
        {
          value: 'ziti',
          label: $t('934ffec2.b30d27')
        },
        {
          value: 'delivery',
          label: $t('20466c3f.705d54')
        },
        {
          value: 'dada',
          label: $t('20466c3f.583dcd')
        }
      ]
    }
  ]
}

//填充标签（写入 drawerData 第一项的 children）
export function fillFilterTag(tagList, drawerData) {
  if (!drawerData || !drawerData[0]) return
  drawerData[0].children = tagList.map((item) => ({
    value: item.tag_id,
    label: item.tag_name
  }))
}

/** 热搜示例词 i18n 键（配合 $t） */
export const SEARCH_DATA_KEYS = [
  '20466c3f.661a96',
  '20466c3f.197bb8',
  '20466c3f.2de328',
  '20466c3f.5e039f',
  '20466c3f.546545',
  '20466c3f.0fe3a5'
]

export function buildBusinessListServices($t) {
  return [
    { id: 'ziti', name: $t('934ffec2.b30d27') },
    { id: 'delivery', name: $t('20466c3f.705d54') },
    { id: 'dada', name: $t('20466c3f.583dcd') }
  ]
}
