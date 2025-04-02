export const RECORD_LIST = {
  activityId: 'activity_id',
  recordId: 'record_id',
  activityName: 'activity_name',
  status: 'status',
  startDate: 'start_date',
  createDate: 'create_date',
  endDate: 'end_date',
  reason: 'reason',
  statusName: 'status_name',
  pics: ({ activity_info }) => {
    if (typeof activity_info?.pics == 'string') {
      return activity_info.pics.split(',')
    } else {
      return activity_info?.pics
    }
  },
  hasTemp: ({ form_id }) => form_id != 0,
  areaName: ({ activity_info }) => activity_info?.area_name,
  actionCancel: ({ action }) => action?.cancel == 1,
  actionEdit: ({ action }) => action?.edit == 1,
  actionApply: ({ action }) => action?.apply == 1,
  activityStatus: ({ activity_info }) => activity_info?.status_name,
  activityStartTime: ({ activity_info }) => activity_info?.start_time
}

export const RECORD_DETAIL = {
  activityId: 'activity_id',
  recordId: 'record_id',
  activityName: 'activity_name',
  status: 'status',
  startDate: 'start_date',
  createDate: 'create_date',
  endDate: 'end_date',
  reason: 'reason',
  statusName: 'status_name',
  activityStatus: ({ activity_info }) => activity_info?.status_name,
  area: 'area',
  intro: ({ start_date, end_date }) => start_date + ' - ' + end_date,
  activityPlace: ({ activity_info }) => activity_info?.place,
  activityAddress: ({ activity_info }) => activity_info?.address,
  formData: ({ content }) => content?.[0]?.formdata,
  recordNo: 'record_no',
  mobile: 'mobile',
  hasTemp: ({ form_id }) => form_id != 0,
  actionCancel: ({ action }) => action?.cancel == 1,
  actionEdit: ({ action }) => action?.edit == 1,
  actionApply: ({ action }) => action?.apply == 1,
  getPoints: 'get_points',
  verifyCode: 'verify_code',
  isOfflineVerify: ({ activity_info }) => activity_info?.is_offline_verify == 1
}
