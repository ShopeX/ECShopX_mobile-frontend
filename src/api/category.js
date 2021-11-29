import req from './req'
import { transformPlatformUrl } from "@/utils/platform";

export function get (params) {
  return req.get('/goods/category', params)
}

export function getCategory (params = {}) {
  return req.get(transformPlatformUrl('/pageparams/setting'), params)
}
