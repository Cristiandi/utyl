export type CsvSeparator = ',' | ';' | '\t' | '|';

export type CsvToJsonOptions = {
  separator: CsvSeparator | 'auto';
  parseNumbers: boolean;
  parseJson: boolean;
  transpose: boolean;
  output: 'array' | 'hash';
  minify: boolean;
};

export type JsonToCsvOptions = {
  separator: CsvSeparator;
};

const defaultSeparators: CsvSeparator[] = [',', ';', '\t', '|'];

function detectSeparator(input: string): CsvSeparator {
  const sample = input.split(/\r?\n/).slice(0, 5).join('\n');
  let best: CsvSeparator = ',';
  let bestCount = -1;
  for (const sep of defaultSeparators) {
    const count = sample.split(sep).length;
    if (count > bestCount) {
      best = sep;
      bestCount = count;
    }
  }
  return best;
}

function parseRow(row: string, separator: CsvSeparator) {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i += 1) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && char === separator) {
      result.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  result.push(current.trim());
  return result;
}

function parseCsv(input: string, separator: CsvSeparator) {
  const rows = input
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0)
    .map((line) => parseRow(line, separator));
  return rows;
}

function coerceValue(value: string, options: Pick<CsvToJsonOptions, 'parseNumbers' | 'parseJson'>) {
  if (options.parseJson) {
    const trimmed = value.trim();
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return value;
      }
    }
  }
  if (options.parseNumbers && /^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  return value;
}

function transposeRows(rows: string[][]) {
  const maxCols = Math.max(...rows.map((row) => row.length), 0);
  const output: string[][] = [];
  for (let col = 0; col < maxCols; col += 1) {
    const next: string[] = [];
    for (let row = 0; row < rows.length; row += 1) {
      next.push(rows[row][col] ?? '');
    }
    output.push(next);
  }
  return output;
}

export function csvToJson(input: string, options: CsvToJsonOptions) {
  const separator =
    options.separator === 'auto'
      ? detectSeparator(input)
      : options.separator;

  let rows = parseCsv(input, separator);
  if (options.transpose) {
    rows = transposeRows(rows);
  }

  const parsed = rows.map((row) =>
    row.map((cell) => coerceValue(cell, options))
  );

  let output: unknown = parsed;
  if (parsed.length > 0) {
    const headers = parsed[0].map((cell) => String(cell));
    const dataRows = parsed.slice(1);

    if (options.output === 'hash') {
      const keyIndex = 0;
      const valueHeaders = headers.slice(1);
      const mapped: Record<string, Record<string, unknown>> = {};
      dataRows.forEach((row) => {
        const key = String(row[keyIndex] ?? '');
        const record: Record<string, unknown> = {};
        valueHeaders.forEach((header, index) => {
          record[header] = row[index + 1] ?? '';
        });
        if (key) {
          mapped[key] = record;
        }
      });
      output = mapped;
    } else {
      output = dataRows.map((row) => {
        const record: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          record[header] = row[index] ?? '';
        });
        return record;
      });
    }
  }

  return options.minify
    ? JSON.stringify(output)
    : JSON.stringify(output, null, 2);
}

export function jsonToCsv(input: string, options: JsonToCsvOptions) {
  const parsed = JSON.parse(input);

  if (Array.isArray(parsed) && parsed.length > 0) {
    if (Array.isArray(parsed[0])) {
      return parsed
        .map((row) => row.map((cell) => String(cell)).join(options.separator))
        .join('\n');
    }

    if (typeof parsed[0] === 'object' && parsed[0] !== null) {
      const headers = Array.from(
        new Set(parsed.flatMap((row) => Object.keys(row)))
      );
      const rows = parsed.map((row) =>
        headers.map((header) => String(row[header] ?? '')).join(options.separator)
      );
      return [headers.join(options.separator), ...rows].join('\n');
    }
  }

  if (typeof parsed === 'object' && parsed !== null) {
    const entries = Object.entries(parsed).map(
      ([key, value]) => `${key}${options.separator}${String(value)}`
    );
    return entries.join('\n');
  }

  return String(parsed);
}
