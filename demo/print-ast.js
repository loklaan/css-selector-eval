const tokenizer = require('../src/tokenizer')
const parser = require('../src/parser')

const border = `
------------------------------------------------------------------------------
`

const data = ['Foo Bar', 'Foo > Bar', 'Foo Bar > Baz Quo']

function formatMsg (selector, ast) {
  let msg = `
${selector}
${'='.repeat(selector.length)}

${JSON.stringify(ast, null, 2)}`

  return msg.replace(/\n/g, '\n  ').replace(/^\n/, '')
}

data.forEach(selector => {
  const tokens = tokenizer(selector)
  const ast = parser(tokens)

  console.log(`${border}\n${formatMsg(selector, ast)}`)
  console.log()
})
console.log(border)
