import req from './req'

export function list () {
  req.get('/region.json')
}

export default {}
