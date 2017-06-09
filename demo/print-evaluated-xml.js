const pify = require('pify')
const parseXml = pify(require('xml2js').parseString)
const getSelectorMatch = require('../src/evaluator')

const border = `
------------------------------------------------------------------------------
`

// language=HTML
const xml = `
<root>
  <Bar>
    <Que>
      <Foo />
    </Que>
  </Bar>
  
  <Baz>
    <Foo />
  </Baz>
</root>
`.trim()

async function print () {
  const parserOpts = {
    explicitChildren: true,
    childkey: 'children',
    explicitArray: false,
    explicitRoot: false
  }
  const tree = await parseXml(xml, parserOpts)
  console.log(border)
  console.log('Parsed XML Tree:')
  console.log(JSON.stringify(tree, null, 2))

  const evaluatorOpts = { getName: (node, key) => key }
  const exitTree = getSelectorMatch('Bar Foo', tree, evaluatorOpts)
  console.log(border)
  console.log('Exit Tree from selector match:')
  console.log(JSON.stringify(exitTree, null, 2))
  console.log(border)
}

print()
