const fs = require('fs')
const path = require('path')

const source = fs.readFileSync(path.resolve(process.cwd(), 'src/hooks/usePayment.js'), 'utf8')

test('doumen_intl payment dispatches to the external cashier branch', () => {
  expect(source).toMatch(/case 'doumen_intl':\s*doumenIntlPay\(params, orderInfo\)\s*break/)
  expect(source).toMatch(/const doumenIntlPay = async \(params, orderInfo\) => \{/)
})

test('doumen_intl redirects through cashier result page when pay_url exists', () => {
  expect(source).toMatch(/const res = await api\.cashier\.getPayment\(\{[\s\S]*return_url:/)
  expect(source).toMatch(/if \(!res \|\| !res\.pay_url\) return payError\(orderInfo\)/)
  expect(source).toMatch(/Taro\.redirectTo\(\{ url: `\$\{cashierResultUrl\}\?order_id=\$\{order_id\}` \}\)/)
  expect(source).toMatch(/window\.location\.href = res\.pay_url/)
})

test('doumen_intl payment type has an i18n label mapping', () => {
  expect(source).not.toMatch(/doumen_intl:\s*'斗门支付'/)
  const constsSource = fs.readFileSync(path.resolve(process.cwd(), 'src/consts/index.js'), 'utf8')
  expect(constsSource).toMatch(/doumen_intl:\s*\$t\('e3a5dbf4\.5833ba'\)/)
})
