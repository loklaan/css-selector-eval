const {
  SELECTOR_EXPRESSION_ROOT,
  SELECTOR_EXPRESSION_CHILD,
  SELECTOR_EXPRESSION_DESCENDANT
} = require('./contants')
const {
  RootExpressionNode,
  ChildExpressNode,
  DescendantExpressionNode
} = require('./node-types')
const { debug } = require('./utils')
const tokenizer = require('./tokenizer')
const parser = require('./parser')

const defaultOptions = {
  getName: (node, nodeKey) => node.name,
  getChildren: (node, nodeKey) => node.children
}

function traverse (selectors, tree, treeKey, options) {
  const selector = selectors[0]
  debug(`\n=======================\ntraversing next tree...`)
  debug(`next selector\n${JSON.stringify(selector, null, 2)}`)
  debug(`next tree\n${JSON.stringify(tree, null, 2)}`)
  debug(`evaluating expression type`)

  const expressionType = selector.type
  switch (expressionType) {
    case SELECTOR_EXPRESSION_DESCENDANT:
      debug("hit 'DESCENDANT COMBINATOR' expression in selector sequence")
      return DescendantExpressionNode(
        traverse,
        selectors,
        tree,
        treeKey,
        options
      )
    case SELECTOR_EXPRESSION_CHILD:
      debug("hit 'CHILD COMBINATOR' expression in selector sequence")
      return ChildExpressNode(traverse, selectors, tree, treeKey, options)
    case SELECTOR_EXPRESSION_ROOT:
      debug("hit 'SELECTOR ROOT' expression in selector sequence")
      return RootExpressionNode(traverse, selectors, tree, treeKey, options)
    default:
      throw new Error('Could not match expression type to a node type.')
  }
}

function evaluate (selector, tree, options) {
  options = Object.assign({}, defaultOptions, options || {})
  debug(`selector syntax: '${selector}'\n`)
  const ast = parser(tokenizer(selector))
  debug(`selector ast:\n${JSON.stringify(ast, null, 2)}\n`)
  debug(`object tree:\n${JSON.stringify(tree, null, 2)}\n`)
  return traverse(ast.selectors, tree, null, options)
}

module.exports = evaluate
