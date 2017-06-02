const {
  ELEMENT,
  COMBINATOR,
  SELECTOR_SEQUENCE,
  SELECTOR_EXPRESSION,
  ELEMENT_LITERAL,
  COMBINATOR_LITERAL
} = require('./contants')
const { debug } = require('./utils')

function createSelectorSequence (selectors) {
  return {
    type: SELECTOR_SEQUENCE,
    selectors
  }
}

function createSelectorExpression (origin, combinator, target) {
  return {
    type: SELECTOR_EXPRESSION,
    origin, combinator, target
  }
}

function createElementLiteral (value) {
  return {
    type: ELEMENT_LITERAL,
    value
  }
}

function createCombinatorLiteral (value) {
  return {
    type: COMBINATOR_LITERAL,
    value
  }
}

/*
Types:
  SelectorSequence (root: RootElementLiteral, selectors: Array<SelectorExpression>) // root
  SelectorExpression (origin: ElementLiteral, combinator: CombinatorLiteral, target: ElementLiteral)
  ElementLiteral (value: String)
  CombinatorLiteral (value: String)
*/

const POS_NEXT_COMBINATOR = 1
const POS_NEXT_ELEM = 2
const POS_AFTER_NEXT_ELEM = 3

function parser (tokens) {
  let initial = 0
  let cursor = initial

  if (tokens[initial].type !== ELEMENT) {
    throw new Error(
      'Invalid token - expected selector sequence to start with an element. Instead was given:', tokens[cursor]
    )
  }
  const ast = createSelectorSequence([
    createSelectorExpression(undefined, undefined, tokens[initial])
  ]);
  debug(`initial ast\n${JSON.stringify(ast, null, 2)}`)

  function walk () {
    let origin = tokens[cursor];
    let combinator = tokens[cursor + POS_NEXT_COMBINATOR];
    let target = tokens[cursor + POS_NEXT_ELEM];

    debug('origin', origin)
    debug('combinator', combinator)
    debug('target', target)

    if (
      (origin && origin.type === ELEMENT) &&
      (combinator && combinator.type === COMBINATOR) &&
      (target && target.type === ELEMENT)
    ) {
      cursor += tokens.length === cursor + POS_AFTER_NEXT_ELEM
        ? POS_AFTER_NEXT_ELEM
        : POS_NEXT_ELEM
      return createSelectorExpression(
        createElementLiteral(origin.value),
        createCombinatorLiteral(combinator.value),
        createElementLiteral(target.value)
      )
    } else {
      throw new Error(
        `Syntax Error: Unexpected selector '${origin.value} ${combinator.value} ${target.value}'`
      )
    }
  }

  while (cursor < tokens.length) {
    debug('begin walk. cursor:', cursor)
    ast.selectors.push(walk())
    debug('end walk. cursor:', cursor)
  }

  debug(`final ast\n${JSON.stringify(ast, null, 2)}`)

  return ast;
}

module.exports = parser
