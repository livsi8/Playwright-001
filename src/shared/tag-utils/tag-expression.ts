interface Token {
  type: 'tag' | 'and' | 'or' | 'not' | 'leftParen' | 'rightParen';
  value: string;
}

type ExpressionNode =
  | { type: 'tag'; value: string }
  | { type: 'not'; node: ExpressionNode }
  | { type: 'and' | 'or'; left: ExpressionNode; right: ExpressionNode };

function tokenize(expression: string): Token[] {
  const matches = expression.match(/@\w+|and|or|not|\(|\)/gi) ?? [];

  return matches.map((part) => {
    const normalized = part.toLowerCase();

    if (normalized === 'and' || normalized === 'or' || normalized === 'not') {
      return { type: normalized, value: normalized };
    }

    if (part === '(') {
      return { type: 'leftParen', value: part };
    }

    if (part === ')') {
      return { type: 'rightParen', value: part };
    }

    return { type: 'tag', value: part };
  });
}

export function matchesTagExpression(expression: string | undefined, tags: readonly string[]): boolean {
  if (!expression || expression.trim().length === 0) {
    return true;
  }

  const tokens = tokenize(expression);
  let index = 0;
  const tagSet = new Set(tags);

  function parseExpression(): ExpressionNode {
    return parseOr();
  }

  function parseOr(): ExpressionNode {
    let node = parseAnd();

    while (tokens[index]?.type === 'or') {
      index += 1;
      node = { type: 'or', left: node, right: parseAnd() };
    }

    return node;
  }

  function parseAnd(): ExpressionNode {
    let node = parseNot();

    while (tokens[index]?.type === 'and') {
      index += 1;
      node = { type: 'and', left: node, right: parseNot() };
    }

    return node;
  }

  function parseNot(): ExpressionNode {
    if (tokens[index]?.type === 'not') {
      index += 1;
      return { type: 'not', node: parseNot() };
    }

    return parsePrimary();
  }

  function parsePrimary(): ExpressionNode {
    const token = tokens[index];

    if (!token) {
      throw new Error(`Unexpected end of tag expression: "${expression}"`);
    }

    if (token.type === 'tag') {
      index += 1;
      return { type: 'tag', value: token.value };
    }

    if (token.type === 'leftParen') {
      index += 1;
      const node = parseExpression();

      if (tokens[index]?.type !== 'rightParen') {
        throw new Error(`Missing closing parenthesis in tag expression: "${expression}"`);
      }

      index += 1;
      return node;
    }

    throw new Error(`Unexpected token "${token.value}" in tag expression "${expression}"`);
  }

  function evaluate(node: ExpressionNode): boolean {
    switch (node.type) {
      case 'tag':
        return tagSet.has(node.value);
      case 'not':
        return !evaluate(node.node);
      case 'and':
        return evaluate(node.left) && evaluate(node.right);
      case 'or':
        return evaluate(node.left) || evaluate(node.right);
      default:
        return false;
    }
  }

  const parsedExpression = parseExpression();

  if (index !== tokens.length) {
    throw new Error(`Unexpected trailing tokens in tag expression: "${expression}"`);
  }

  return evaluate(parsedExpression);
}
