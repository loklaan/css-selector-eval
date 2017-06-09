const {
  ELEMENT_TOKEN,
  COMBINATOR_TOKEN,
  CHILD_COMBINATOR_VALUE,
  DESC_COMBINATOR_VALUE
} = require('./contants')

const RGX_WHITESPACE = /\s/
const RGX_WORD = /\w/

function tokenizer (input) {
  let cursor = 0
  let tokens = []

  while (cursor < input.length) {
    let char = input[cursor]

    // Note: order checks by compute expense

    if (char === '>') {
      tokens.push({ type: COMBINATOR_TOKEN, value: CHILD_COMBINATOR_VALUE })
      cursor++
      continue
    }

    if (RGX_WHITESPACE.test(char)) {
      cursor++
      continue
    }

    if (RGX_WORD.test(char)) {
      value = ''
      while (char && RGX_WORD.test(char)) {
        value += char
        char = input[++cursor]
      }
      tokens.push({ type: ELEMENT_TOKEN, value: value })
      continue
    }

    console.error('Should not have reached')
    cursor++
  }

  tokens = tokens.reduce((accum, token, i) => {
    accum.push(token)
    if (
      token.type === ELEMENT_TOKEN &&
      tokens[i + 1] &&
      tokens[i + 1].type === ELEMENT_TOKEN
    ) {
      accum.push({ type: COMBINATOR_TOKEN, value: DESC_COMBINATOR_VALUE })
    }
    return accum
  }, [])

  return tokens
}

module.exports = tokenizer
