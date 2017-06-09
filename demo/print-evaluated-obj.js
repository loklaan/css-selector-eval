const evaluate = require('../src/evaluator')

const border = `
------------------------------------------------------------------------------
`

const model = {
  children: [
    {
      name: 'Foo',
      children: [
        {
          name: 'Nope',
          children: [
            {
              name: 'Baz',
              children: [
                {
                  name: 'Bar',
                  children: [
                    {
                      name: 'Nope2',
                      children: [
                        {
                          name: 'Quo'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

console.log(border)
console.log('Object Tree:')
console.log(JSON.stringify(model, null, 2))

const exitNode = evaluate('Foo Baz > Bar Quo', model)
console.log(border)
console.log('Exit Tree from selector match:')
console.log(JSON.stringify(exitNode, null, 2))

console.log(border)
