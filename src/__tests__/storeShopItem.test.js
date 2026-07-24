const fs = require('fs')
const path = require('path')

const source = fs.readFileSync(
  path.resolve(process.cwd(), 'src/subpages/store/comps/comp-shopitem.js'),
  'utf8'
)

test('store list contact phone only renders when show_mobile is 1', () => {
  expect(source).toMatch(/String\(info\.show_mobile\) === '1'/)
  expect(source).toMatch(
    /\{String\(info\.show_mobile\) === '1' && \(\s*<View className='shop-desc'>[\s\S]*?\$t\('17a2cf99\.7d33dc'\)[\s\S]*?info\.mobile[\s\S]*?<\/View>\s*\)\}/
  )
})
