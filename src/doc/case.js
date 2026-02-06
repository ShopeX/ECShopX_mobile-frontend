/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

// 案例列表
export const CASE_LIST = {
  id: 'id',
  design_id: 'design_id',
  plan_id: 'plan_id',
  cover_pic: 'cover_pic',
  design_name: 'design_name',
  tagList: ({ taginfo }) =>
    taginfo ? taginfo.filter((tagItem) => tagItem.tag_category_name === '风格') : [],
  taginfo: 'taginfo'
}

// 案例详情
export const CASE_DETAIL = {
  cover_pic: 'basicInfo.cover_pic',
  design_name: 'basicInfo.design_name',
  design_pano_url: 'basicInfo.design_mesh_url',
  comm_name: 'basicInfo.comm_name',
  levelinfo: 'levelinfo',
  taginfo: 'taginfo',
  picinfo: 'picinfo'
}
