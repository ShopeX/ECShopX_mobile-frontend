import req from './req'

export function getImConfigByDistributor (distributor_id) {
  return req.get(`/im/meiqia/distributor/${distributor_id}`)
}
