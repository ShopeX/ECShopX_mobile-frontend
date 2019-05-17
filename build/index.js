const path = require('path')
const glob = require('glob')
const fs = require('fs-extra')

const SRC_PATH = path.resolve(__dirname, '../dist')
const DIST_PATH = path.resolve(__dirname, '../dist_iwa')
const pagesToCopy = [
  'article/index',
  'recommend/list',
  'item/list'
]

const files = glob.sync('**/*', {
  cwd: SRC_PATH,
  nodir: true,
  ignore: [
    'app.json',
    'pages/**/*',
    'project.config*',
    'assets/**/*'
  ]
})

const include = results => file => {
  return results.some(name => file.indexOf(name) >= 0)
}

const pages = glob.sync('pages/**/*.*', {
    cwd: SRC_PATH
  })
  .filter(include(pagesToCopy))

async function copyFile (file) {
  const from = path.resolve(SRC_PATH, file)
  const to = path.resolve(DIST_PATH, file)
  await fs.copySync(from, to)
}

fs.emptyDir(DIST_PATH)
  .then(() => {
    [...files, ...pages].forEach(copyFile)

    fs.copy(path.resolve(__dirname, 'template'), DIST_PATH, err => {
      if (err) console.error(err)
    })
  })
