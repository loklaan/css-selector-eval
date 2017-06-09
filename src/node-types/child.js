const reduce = require('lodash.reduce')
const { debug } = require('../utils')

function ChildExpressNode (traverse, selectors, tree, treeKey, options) {
  const selector = selectors[0]
  const targetNodeName = selector.target.value

  return reduce(
    options.getChildren(tree, treeKey),
    (exitNode, child, childKey) => {
      const childName = options.getName(child, childKey)
      if (exitNode) return exitNode
      debug('evaluating a child node:', `"${childName}":`, child)
      if (childName === targetNodeName) {
        if (options.getChildren(child, childKey)) {
          const nextSelectors = selectors.slice(1)
          if (nextSelectors) {
            debug(
              'combinator satisfied by child node, traversing with next selector'
            )
            const exitTree = traverse(nextSelectors, child, childKey, options)
            if (exitTree) {
              return { name: selector.target.value, child: exitTree }
            } else {
              return false
            }
          } else {
            return { name: targetNodeName, node: child }
          }
        } else {
          return { name: targetNodeName }
        }
      }
      debug('bailing on child...')
      return false
    },
    false
  )
}

module.exports = ChildExpressNode
