/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { P_SELF, P_PARENT, P_SPOUSE, P_CHILD, P_OTHER } from './i18n-keys'

export function getRelationshipOptions($t) {
  return [
    { key: 1, value: $t(P_SELF) },
    { key: 2, value: $t(P_PARENT) },
    { key: 3, value: $t(P_SPOUSE) },
    { key: 4, value: $t(P_CHILD) },
    { key: 5, value: $t(P_OTHER) }
  ]
}
