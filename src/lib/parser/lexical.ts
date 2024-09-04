enum Token {
  // Operators
  ADD, // +
  SUB, // -
  MUL, // *
  DIV, // /
  POW, // ^

  // Grouping
  OPEN_PAREN, // (
  CLOSE_PAREN, // )

  // Literals
  Number,
  X,
}

// @ts-expect-error
interface TokenInfo {
  Tok: Token
  Value: string
}

export default class Lexicaler {}
