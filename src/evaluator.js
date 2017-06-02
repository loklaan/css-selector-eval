const {
  CHILD_COMBINATOR,
  DESC_COMBINATOR
} = require('./contants')
const { debug } = require('./utils')
const tokenizer = require('./tokenizer')
const parser = require('./parser')

function traverse (selectors, tree) {
  const selector = selectors[0]
  debug(`next selector\n${JSON.stringify(selector, null, 2)}`)
  debug(`next tree\n${JSON.stringify(tree, null, 2)}`)
  if (!selector || !tree.children) return {fucker: 1}

  const name = selector.target.value;
  const combinator = selector.combinator && selector.combinator.value
  switch (combinator) {
    case DESC_COMBINATOR:
      debug('HIT DESC_COMBINATOR')
      function traverseToChild(exitNode, child) {
        debug('traversing next level of child, for DESC_COMBINATOR targeting', name)
        if (exitNode) return exitNode
        if (child.name === name) {
          if (child.children) {
            const nextSelectors = selectors.slice(1);
            if (nextSelectors) {
              debug('descendant match found - traversing deeper with next selectors')
              const exitTree = traverse(nextSelectors, child)
              if (exitTree) {
                return { name: selector.target.value, child: exitTree }
              } else {
                return false
              }
            } else {
              return { name, node: child }
            }
          } else {
            return { name }
          }
        } else if (child.children) {
          debug('traversing more descendants...')
          const exitTree = child.children.reduce(traverseToChild, exitNode)
          if (exitTree) {
            return { name: child.name, child: exitTree }
          } else {
            return false
          }
        } else {
          debug('bailing on descendant tree...')
          return false
        }
      }

      return tree.children.reduce(traverseToChild, false)
    case undefined:
    case CHILD_COMBINATOR:
      combinator === undefined && debug('HIT SELECTOR ROOT')
      combinator === CHILD_COMBINATOR && debug('HIT CHILD_COMBINATOR')
      return tree.children.reduce((exitNode, child) => {
        debug('hit child, child:', child)
        if (exitNode) return exitNode
        if (child.name === name) {
          if (child.children) {
            const nextSelectors = selectors.slice(1);
            if (nextSelectors) {
              debug('traversing deeper...')
              const exitTree = traverse(nextSelectors, child)
              if (exitTree) {
                return { name: selector.target.value, child: exitTree }
              } else {
                return false
              }
            } else {
              return { name, node: child }
            }
          } else {
            return { name }
          }
        }
        debug('bailing on child...')
        return false
      }, false)
    default:
  }
}

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

function evaluate (selector, tree) {
  debug('evaluate:', selector)
  const { selectors } = parser(tokenizer(selector));
  console.log('\n'+JSON.stringify(traverse(selectors, tree), null, 2))
}

evaluate('Foo Baz > Bar Quo', model)
