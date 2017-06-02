const tokenizer = require('./tokenizer.js')
const parser = require('./parser.js')

const border = `
------------------------------------------------------------------------------
`

const data = [
  'Foo Bar',
  'Foo > Bar',
  'Foo Bar > Baz Quo'
]

data.forEach(selector => {
  const tokens = tokenizer(selector)
  const ast = parser(tokens)
  const msg = `
${selector}
${'='.repeat(selector.length)}

${JSON.stringify(ast, null, 2)}`.replace(/\n/g, '\n  ').replace(/^\n/, '');

  console.log(`${border}${msg}${border}`)
  console.log()
})
