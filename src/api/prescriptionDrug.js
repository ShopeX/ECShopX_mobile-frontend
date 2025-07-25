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
