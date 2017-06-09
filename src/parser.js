const {
  CHILD_COMBINATOR_VALUE,
  DESC_COMBINATOR_VALUE,
  ELEMENT_TOKEN,
  COMBINATOR_TOKEN,
  SELECTOR_SEQUENCE,
  SELECTOR_EXPRESSION_ROOT,
  SELECTOR_EXPRESSION_CHILD,
  SELECTOR_EXPRESSION_DESCENDANT,
  ELEMENT_LITERAL,
  COMBINATOR_LITERAL
} = require('./contants')

function createSelectorSequence (selectors) {
  return {
    type: SELECTOR_SEQUENCE,
    selectors
  }
}

function createSelectorExpression (origin, combinator, target) {
  let type
  if (!origin && !combinator && target) {
    type = SELECTOR_EXPRESSION_ROOT
  } else if (combinator.value === CHILD_COMBINATOR_VALUE) {
    type = SELECTOR_EXPRESSION_CHILD
  } else if (combinator.value === DESC_COMBINATOR_VALUE) {
    type = SELECTOR_EXPRESSION_DESCENDANT
  } else {
    throw new Error('Could not parse the selector expression.')
  }

  return {
    type: type,
    origin,
    combinator,
    target
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

  if (tokens[initial].type !== ELEMENT_TOKEN) {
    throw new Error(
      'Invalid token - expected selector sequence to start with an element. Instead was given:',
      tokens[cursor]
    )
  }
  const ast = createSelectorSequence([
    createSelectorExpression(undefined, undefined, tokens[initial])
  ])

  function walk () {
    let origin = tokens[cursor]
    let combinator = tokens[cursor + POS_NEXT_COMBINATOR]
    let target = tokens[cursor + POS_NEXT_ELEM]

    if (
      origin &&
      origin.type === ELEMENT_TOKEN &&
      (combinator && combinator.type === COMBINATOR_TOKEN) &&
      (target && target.type === ELEMENT_TOKEN)
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
    ast.selectors.push(walk())
  }

  return ast
}

module.exports = parser
