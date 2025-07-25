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

export const ACTIVITY_LIST = {
  activityId: 'activity_id',
  recordId: 'record_id',
  activityName: 'activity_name',
  status: 'status',
  intro: 'intro',
  activityStartTime: 'start_date',
  createDate: 'create_date',
  endDate: 'end_date',
  reason: 'reason',
  areaName: 'area_name',
  activityStatus: 'status_name',
  pics: ({ pics }) => pics?.split(','),
  hasTemp: ({ temp_id }) => temp_id != '0',
  area: 'area',
  showPlace: ({ show_fields }) => JSON.parse(show_fields)?.place == 1,
  showAddress: ({ show_fields }) => JSON.parse(show_fields)?.address == 1,
  showCity: ({ show_fields }) => JSON.parse(show_fields)?.city == 1,
  joinLimit: 'join_limit',
  totalJoinNum: 'total_join_num',
  isAllowDuplicate: ({ is_allow_duplicate }) => is_allow_duplicate == 1,
  recordId: ({ record_info }) => record_info?.[0]?.record_id,
  recordStatus: ({ record_info }) => record_info?.[0]?.status
}

export const ACTIVITY_DETAIL = {
  pics: ({ pics }) => pics.split(','),
  activityId: 'activity_id',
  activityName: 'activity_name',
  content: 'content',
  place: 'place',
  address: 'address',
  startDate: 'start_date',
  endDate: 'end_date',
  joinLimit: 'join_limit',
  status: 'status',
  recordId: ({ record_info }) => record_info?.[0]?.record_id,
  recordStatus: ({ record_info }) => record_info?.[0]?.status,
  isAllowDuplicate: ({ is_allow_duplicate }) => is_allow_duplicate == 1,
  hasTemp: ({ temp_id }) => temp_id != '0',
  showPlace: ({ show_fields }) => JSON.parse(show_fields)?.place == 1,
  showAddress: ({ show_fields }) => JSON.parse(show_fields)?.address == 1,
  showTime: ({ show_fields }) => JSON.parse(show_fields)?.time == 1
}
