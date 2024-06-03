import { formatDateTime } from '@/utils'
export const ACTIVITY_ITEM = {
  enterpriseId: 'enterprise_id',
  employeeBeginTime: ({ employee_begin_time }) => {
    return formatDateTime(employee_begin_time)
  },
  employeeEndTime: ({ employee_end_time }) => {
    return formatDateTime(employee_end_time)
  },
  id: 'id',
  name: 'name',
  pic: 'pic',
  pages_template_id: 'pages_template_id',
  role: ({ is_employee, is_relative }) => {
    if (is_employee == 1) {
      return '员工'
    } else if (is_relative == 1) {
      return '亲友'
    }
  }
}
