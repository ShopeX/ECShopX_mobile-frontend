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
import api from '@/api'
import { log } from '@/utils'

class FormIds {
  constructor(options = {}) {
    this._collectingFormIdsTimer = null
    this._formIds = []
    this.options = {
      duration: 30 * 1000,
      ...options
    }
  }

  startCollectingFormIds() {
    if (this._collectingFormIdsTimer) {
      clearInterval(this._collectingFormIdsTimer)
    }

    const collecting = () => {
      this.flush()
    }

    this._collectingFormIdsTimer = setInterval(collecting, this.options.duration)
    log.debug(`[form-ids] start collecting`)
  }

  collectFormIds(ids, sync) {
    if (!ids) return
    if (!Array.isArray(ids)) {
      ids = [ids]
    }

    if (sync) {
      this.flush(ids)
    } else {
      this._formIds = [...this._formIds, ...ids]
    }
  }

  async flush(ids = [], needsMerge = true, needsClean = true) {
    if (needsMerge) {
      ids = [...this._formIds, ...ids]
    }
    ids = ids.filter((id) => id !== 'the formId is a mock one')

    if (!ids.length) return
    ids = ids.join(',')

    log.debug(`[form-ids] sending ids: `, ids)

    try {
      await api.member.formId(ids)
    } catch (e) {
      console.log(e)
    }

    if (needsClean) {
      this._formIds = []
    }
  }

  stop() {
    if (this._collectingFormIdsTimer) {
      clearInterval(this._collectingFormIdsTimer)
      log.debug(`[form-ids] stop collecting`)
    }
  }
}

export default new FormIds()
