export type QuoteStyle = 'none' | 'double' | 'single';
export type DelimiterStyle = ',' | ';' | '|' | 'space';
export type SortStyle = 'none' | 'asc' | 'desc';

export type DelimiterOptions = {
  delimiter: DelimiterStyle;
  customDelimiter?: string;
  quoteStyle: QuoteStyle;
  quoteOnlyIfNeeded: boolean;
  trimWhitespace: boolean;
  removeEmpty: boolean;
  deduplicate: boolean;
  sort: SortStyle;
};

const quoteMap: Record<QuoteStyle, string> = {
  none: '',
  double: '"',
  single: "'",
};

function stripOuterQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function normalizeDelimiter(
  delimiter: DelimiterStyle,
  customDelimiter?: string
) {
  const custom = customDelimiter?.trim();
  if (custom) {
    return custom === ' ' ? 'space' : custom;
  }
  return delimiter;
}

function splitByDelimiter(input: string, delimiter: DelimiterStyle | string) {
  const normalized = input.replace(/\r?\n/g, ' ');
  if (delimiter === 'space' || delimiter === ' ') {
    return normalized.split(/\s+/);
  }
  const escaped = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return normalized.split(new RegExp(`\\s*${escaped}\\s*`));
}

function splitByLines(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function joinDelimited(tokens: string[], delimiter: DelimiterStyle | string) {
  const joiner =
    delimiter === 'space' || delimiter === ' ' ? ' ' : `${delimiter}`;
  return tokens.join(joiner);
}

function processTokens(
  tokens: string[],
  options: Pick<
    DelimiterOptions,
    'trimWhitespace' | 'removeEmpty' | 'deduplicate' | 'sort'
  >
) {
  let next = tokens.map((token) => token);
  if (options.trimWhitespace) {
    next = next.map((token) => token.trim());
  }
  if (options.removeEmpty) {
    next = next.filter((token) => token.length > 0);
  }
  if (options.deduplicate) {
    const seen = new Set<string>();
    next = next.filter((token) => {
      if (seen.has(token)) {
        return false;
      }
      seen.add(token);
      return true;
    });
  }
  if (options.sort === 'asc') {
    next = [...next].sort((a, b) => a.localeCompare(b));
  } else if (options.sort === 'desc') {
    next = [...next].sort((a, b) => b.localeCompare(a));
  }
  return next;
}

function shouldQuote(token: string, delimiter: DelimiterStyle | string) {
  if (delimiter === 'space' || delimiter === ' ') {
    return /\s/.test(token);
  }
  return token.includes(delimiter);
}

export function formatDelimiterComma(
  input: string,
  direction: 'toDelimited' | 'toColumn',
  options: DelimiterOptions
) {
  const normalizedDelimiter = normalizeDelimiter(
    options.delimiter,
    options.customDelimiter
  );
  const tokens =
    direction === 'toDelimited'
      ? splitByLines(input)
      : splitByDelimiter(input, normalizedDelimiter);

  const cleaned = processTokens(
    tokens.map((token) => stripOuterQuotes(token)),
    {
      trimWhitespace: options.trimWhitespace,
      removeEmpty: options.removeEmpty,
      deduplicate: options.deduplicate,
      sort: options.sort,
    }
  );

  const quote = quoteMap[options.quoteStyle];
  const wrapped = cleaned.map((token) => {
    if (!quote) {
      return token;
    }
    if (options.quoteOnlyIfNeeded) {
      return shouldQuote(token, normalizedDelimiter)
        ? `${quote}${token}${quote}`
        : token;
    }
    return `${quote}${token}${quote}`;
  });

  if (direction === 'toColumn') {
    return wrapped.join('\n');
  }

  return joinDelimited(wrapped, normalizedDelimiter);
}
