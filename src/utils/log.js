const noop = () => {}

const debug = (...args) => {
  let cArgs = []
  args.forEach(item => {
    const cItem = typeof item !== 'object' ? ['%c' + item, 'color: #3e76f6; font-weight: normal;'] : item
    cArgs = cArgs.concat(cItem)
  })

  console.groupCollapsed(...cArgs)
  console.trace(...args)
  console.groupEnd()
}

const log = {
  ...console,
  debug: process.env.NODE_ENV === 'development' ? debug : noop
}

export default log