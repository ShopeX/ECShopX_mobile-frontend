

export const STORECLASSIFY_SELECT = {
  title: 'category_name',
  id: 'category_id',
  image: 'image_url',
  name: 'category_name',
  children: ({ children }) => {
    return (
      children &&
      children.length > 0 &&
      children?.map((item) => {
        return {
          id: item.category_id,
          name: item.category_name,
          image: item.image_url
        }
      })
    )
  }
}

export const STORECLASSIFY = {
  title: ({ category_name, current_category_name }) => current_category_name || category_name,
  id: 'category_id',
  image: 'image_url',
  name: ({ category_name, current_category_name }) => current_category_name || category_name,
  store_ids: 'store_ids'
}
