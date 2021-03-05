export function resolveFavsList (list, favs) {
  return list.map(t => {
    const { item_id } = t
    return {
      ...t,
      is_fav: Boolean(favs[item_id])
    }
  })
}
