/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { $t, ti } from '@/i18n'
import log, { showToast } from './utils'

class MAPPPay {
  constructor() {
    if (!MAPPPay.instance) {
      this.pays = {}
      MAPPPay.instance = this
    }
    return MAPPPay.instance
  }

  /**
   * 获取可用支付列表
   */
  getPayList() {
    return new Promise((resolve, reject) => {
      plus.payment.getChannels(
        (channels) => {
          var result = []
          log.info('getPayList: ' + JSON.stringify(channels))
          channels.forEach((item) => {
            this.pays[item.id] = item
            result.push({
              id: item.id,
              name: item.description
            })
          })
          resolve(result)
        },
        (e) => {
          showToast(ti('18e3b4b3.5d9c92', [e.message]))
          reject(e)
        }
      )
    })
  }

  /**
   * 支付
   */
  payment(params) {
    const payid = params.id || ''
    const order = params.order_params || {}

    const channel = this.pays[payid]
    log.info('payment: ' + JSON.stringify(params))
    return new Promise(function (resolve, reject) {
      if (!channel.serviceReady) {
        let txt = null
        switch (payid) {
          case 'alipay':
            txt = $t('18e3b4b3.8dc97f')
            break
          default:
            txt = ti('18e3b4b3.94c89e', [channel.description])
            break
        }
        plus.nativeUI.confirm(
          txt,
          (e) => {
            if (e.index == 0) {
              channel.installService()
              return
            }
          },
          channel.description
        )
        reject(txt)
      } else {
        plus.payment.request(
          channel,
          order,
          (result) => {
            resolve(result)
          },
          (e) => {
            // 排除用户中途取消
            if (e.message.indexOf('User canceled') > -1 || e.message.indexOf('62001') > -1) {
            } else {
              showToast(ti('18e3b4b3.9ebf1b', [e.message]))
            }
            reject(e)
          }
        )
      }
    })
  }
}

export default new MAPPPay()
