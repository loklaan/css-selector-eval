const reduce = require('lodash.reduce')
const { debug } = require('../utils')

function DescendantExpressionNode (traverse, selectors, tree, treeKey, options) {
  const selector = selectors[0]
  const targetNodeName = selector.target.value

  function traverseDescendants (exitNode, child, childKey) {
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
          debug(
            'combinator satisfied by child node with no more selectors - exiting'
          )
          return { name: targetNodeName, node: child }
        }
      } else {
        debug(
          'combinator satisfied by child node with no more children - exiting'
        )
        return { name: targetNodeName }
      }
    } else if (options.getChildren(child, childKey)) {
      debug(
        'combinator unsatisfied by child node, traversing deeper into children'
      )
      const exitTree = reduce(
        options.getChildren(child, childKey),
        traverseDescendants,
        exitNode
      )
      if (exitTree) {
        return { name: childName, child: exitTree }
      } else {
        return false
      }
    } else {
      debug(
        'combinator unsatisfied by child node with no more children - bailing...'
      )
      return false
    }
  }

  return reduce(options.getChildren(tree, treeKey), traverseDescendants, false)
}

module.exports = DescendantExpressionNode
