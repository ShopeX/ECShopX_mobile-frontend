// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------
import req from './req'

//新增用药人
export function medicationPersonnel(params) {
  // 员工身份验证
  return req.post('/medicationPersonnel', params)
}

//用药人列表
export function medicationPersonnelList(params = {}) {
  return req.get('/medicationPersonnel/list', params)
}

//用药人详情
export function medicationPersonnelDetail(params = {}) {
  return req.get('/medicationPersonnel/detail', params)
}

//用药人删除
export function deleteMedicationPersonnel(params = {}) {
  return req.delete('/medicationPersonnel', params)
}

//用药人修改
export function putMedicationPersonnel(params = {}) {
  return req.put('/medicationPersonnel', params)
}

//新增问诊单
export function prescriptionDiagnosis(params) {
  // 员工身份验证
  return req.post('/prescription/diagnosis', params)
}
