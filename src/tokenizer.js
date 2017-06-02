const { ELEMENT, COMBINATOR, CHILD_COMBINATOR, DESC_COMBINATOR } = require('./contants')

const RGX_WHITESPACE = /\s/
const RGX_WORD = /\w/

function tokenizer (input) {
  let cursor = 0
  let tokens = []

  while (cursor < input.length) {
    let char = input[cursor]

    // Note: order checks by compute expense

    if (char === '>') {
      tokens.push({type: COMBINATOR, value: CHILD_COMBINATOR})
      cursor++
      continue;
    }

    if (RGX_WHITESPACE.test(char)) {
      cursor++
      continue;
    }

    if (RGX_WORD.test(char)) {
      value = ''
      while (char && RGX_WORD.test(char)) {
        value += char;
        char = input[++cursor];
      }
      tokens.push({type: ELEMENT, value: value})
      continue;
    }

    console.error('Should not have reached')
    cursor++
    continue;
  }

  tokens = tokens.reduce((accum, token, i) => {
    accum.push(token)
    if (
      token.type === ELEMENT &&
      tokens[i+1] &&
      tokens[i+1].type === ELEMENT
    ) {
      accum.push({type: COMBINATOR, value: DESC_COMBINATOR})
    }
    return accum
  }, [])

  return tokens
}

module.exports = tokenizer;
